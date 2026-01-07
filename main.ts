import { App, Editor, MarkdownView, Notice, Plugin, PluginSettingTab, Setting, requestUrl } from 'obsidian';

interface MarkdownFormatFixerSettings {
	claudeApiKey: string;
}

const DEFAULT_SETTINGS: MarkdownFormatFixerSettings = {
	claudeApiKey: ''
}

export default class MarkdownFormatFixerPlugin extends Plugin {
	settings: MarkdownFormatFixerSettings;

	async onload() {
		console.log('Loading Markdown Format Fixer plugin');

		await this.loadSettings();

		// 리본 아이콘 추가
		this.addRibbonIcon('wand-glyph', 'Fix Markdown Format', () => {
			this.fixMarkdownFormat();
		});

		// 명령어 팔레트에 추가
		this.addCommand({
			id: 'fix-markdown-format',
			name: 'Fix Markdown Format',
			editorCallback: (editor: Editor, view: MarkdownView) => {
				this.fixMarkdownFormatInEditor(editor);
			}
		});

		// 설정 탭 추가
		this.addSettingTab(new MarkdownFormatFixerSettingTab(this.app, this));
	}

	onunload() {
		console.log('Unloading Markdown Format Fixer plugin');
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	/**
	 * 현재 활성 파일의 마크다운 서식을 수정
	 */
	async fixMarkdownFormat() {
		const activeView = this.app.workspace.getActiveViewOfType(MarkdownView);

		if (!activeView) {
			new Notice('활성 마크다운 파일이 없습니다');
			return;
		}

		const editor = activeView.editor;
		await this.fixMarkdownFormatInEditor(editor);
	}

	/**
	 * 에디터의 마크다운 서식을 수정
	 */
	async fixMarkdownFormatInEditor(editor: Editor) {
		if (!this.settings.claudeApiKey) {
			new Notice('⚠️ Claude API 키를 먼저 설정해주세요');
			return;
		}

		const content = editor.getValue();

		if (!content.trim()) {
			new Notice('수정할 내용이 없습니다');
			return;
		}

		const loadingNotice = new Notice('🤖 Claude가 마크다운을 수정하고 있습니다...', 0);

		try {
			const fixed = await this.fixWithClaude(content);

			if (fixed && fixed !== content) {
				editor.setValue(fixed);
				loadingNotice.hide();
				new Notice('✓ 마크다운 서식이 수정되었습니다');
			} else {
				loadingNotice.hide();
				new Notice('수정할 항목이 없습니다');
			}
		} catch (error) {
			loadingNotice.hide();
			console.error('Error fixing markdown:', error);
			new Notice(`❌ 오류: ${error.message}`);
		}
	}

	/**
	 * Claude API를 사용하여 마크다운 수정
	 */
	async fixWithClaude(content: string): Promise<string> {
		const response = await requestUrl({
			url: 'https://api.anthropic.com/v1/messages',
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'x-api-key': this.settings.claudeApiKey,
				'anthropic-version': '2023-06-01'
			},
			body: JSON.stringify({
				model: 'claude-3-haiku-20240307',
				max_tokens: 8192,
				messages: [
					{
						role: 'user',
						content: `다음 마크다운 텍스트에서 잘못된 서식을 수정해주세요. 수정이 필요한 패턴:

1. *텍스트: * → **텍스트:**
2. *텍스트 * → **텍스트**
3. _텍스트: _ → **텍스트:**
4. _텍스트 _ → **텍스트**
5. **텍스트: ** → **텍스트:**
6. **텍스트 ** → **텍스트**
7. \`텍스트: \` → \`텍스트:\`
8. \`텍스트 \` → \`텍스트\`

주의사항:
- 코드 블록(\`\`\`)안의 내용은 수정하지 마세요
- 원본 텍스트의 구조와 내용을 유지하세요
- 오직 위의 패턴만 수정하세요
- 수정된 마크다운만 출력하고, 설명은 추가하지 마세요

마크다운:
${content}`
					}
				]
			})
		});

		if (response.status !== 200) {
			const error = response.json;
			throw new Error(error.error?.message || `API 오류: ${response.status}`);
		}

		const data = response.json;

		// 응답 유효성 검사
		if (!data || !data.content || !Array.isArray(data.content) || data.content.length === 0) {
			throw new Error('API 응답 형식이 올바르지 않습니다');
		}

		const textContent = data.content[0];
		if (!textContent || textContent.type !== 'text' || typeof textContent.text !== 'string') {
			throw new Error('API 응답에서 텍스트를 찾을 수 없습니다');
		}

		return textContent.text;
	}
}

class MarkdownFormatFixerSettingTab extends PluginSettingTab {
	plugin: MarkdownFormatFixerPlugin;

	constructor(app: App, plugin: MarkdownFormatFixerPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		containerEl.createEl('h2', { text: 'Markdown Format Fixer 설정' });

		new Setting(containerEl)
			.setName('Claude API Key')
			.setDesc('Anthropic Claude API 키를 입력하세요. API 키는 https://console.anthropic.com/ 에서 발급받을 수 있습니다.')
			.addText(text => text
				.setPlaceholder('sk-ant-...')
				.setValue(this.plugin.settings.claudeApiKey)
				.onChange(async (value) => {
					this.plugin.settings.claudeApiKey = value;
					await this.plugin.saveSettings();
				}));

		containerEl.createEl('h3', { text: '사용 방법' });

		const usageEl = containerEl.createEl('div', { cls: 'markdown-format-fixer-usage' });
		usageEl.createEl('p', { text: '1. 리본 아이콘(🪄) 클릭' });
		usageEl.createEl('p', { text: '2. 명령어 팔레트(Cmd/Ctrl+P) → "Fix Markdown Format"' });

		containerEl.createEl('h3', { text: '수정되는 패턴' });

		const patternsEl = containerEl.createEl('div', { cls: 'markdown-format-fixer-patterns' });
		patternsEl.createEl('p', { text: '• *텍스트: * → **텍스트:**' });
		patternsEl.createEl('p', { text: '• *텍스트 * → **텍스트**' });
		patternsEl.createEl('p', { text: '• _텍스트: _ → **텍스트:**' });
		patternsEl.createEl('p', { text: '• _텍스트 _ → **텍스트**' });
		patternsEl.createEl('p', { text: '• **텍스트: ** → **텍스트:**' });
		patternsEl.createEl('p', { text: '• **텍스트 ** → **텍스트**' });
		patternsEl.createEl('p', { text: '• `텍스트: ` → `텍스트:`' });
		patternsEl.createEl('p', { text: '• `텍스트 ` → `텍스트`' });

		containerEl.createEl('p', {
			text: '⚠️ 코드 블록 안의 내용은 수정되지 않습니다.',
			cls: 'mod-warning'
		});
	}
}
