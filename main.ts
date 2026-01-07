import { App, Editor, MarkdownView, Notice, Plugin } from 'obsidian';

interface FixResult {
	fixed: string;
	count: number;
}

export default class MarkdownFormatFixerPlugin extends Plugin {
	async onload() {
		console.log('Loading Markdown Format Fixer plugin');

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
	}

	onunload() {
		console.log('Unloading Markdown Format Fixer plugin');
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
		this.fixMarkdownFormatInEditor(editor);
	}

	/**
	 * 에디터의 마크다운 서식을 수정
	 */
	fixMarkdownFormatInEditor(editor: Editor) {
		const content = editor.getValue();
		const result = this.fixPatterns(content);

		if (result.count > 0) {
			editor.setValue(result.fixed);
			new Notice(`✓ ${result.count}개 항목이 수정되었습니다`);
		} else {
			new Notice('수정할 항목이 없습니다');
		}
	}

	/**
	 * 잘못된 마크다운 패턴을 수정
	 * @param content 원본 마크다운 텍스트
	 * @returns 수정된 텍스트와 수정 개수
	 */
	fixPatterns(content: string): FixResult {
		let fixed = content;
		let count = 0;

		// 코드 블록을 임시로 보호
		const codeBlocks: string[] = [];
		fixed = fixed.replace(/```[\s\S]*?```/g, (match) => {
			codeBlocks.push(match);
			return `__CODE_BLOCK_${codeBlocks.length - 1}__`;
		});

		// 패턴 1: *text: * → **text:**
		fixed = fixed.replace(/\*([^*\n]+?):\s*\*/g, (match) => {
			count++;
			return match.replace(/\*([^*\n]+?):\s*\*/g, '**$1:**');
		});

		// 패턴 2: *text * (콜론 없음) → **text**
		fixed = fixed.replace(/\*([^*:\n]+?)\s+\*/g, (match) => {
			count++;
			return match.replace(/\*([^*:\n]+?)\s+\*/g, '**$1**');
		});

		// 패턴 3: _text: _ → **text:**
		fixed = fixed.replace(/_([^_\n]+?):\s*_/g, (match) => {
			count++;
			return match.replace(/_([^_\n]+?):\s*_/g, '**$1:**');
		});

		// 패턴 4: _text _ (콜론 없음) → **text**
		fixed = fixed.replace(/_([^_:\n]+?)\s+_/g, (match) => {
			count++;
			return match.replace(/_([^_:\n]+?)\s+_/g, '**$1**');
		});

		// 패턴 5: **text: ** → **text:**
		fixed = fixed.replace(/\*\*([^*\n]+?):\s*\*\*/g, (match) => {
			count++;
			return match.replace(/\*\*([^*\n]+?):\s*\*\*/g, '**$1:**');
		});

		// 패턴 6: **text ** (콜론 없음) → **text**
		fixed = fixed.replace(/\*\*([^*:\n]+?)\s+\*\*/g, (match) => {
			count++;
			return match.replace(/\*\*([^*:\n]+?)\s+\*\*/g, '**$1**');
		});

		// 패턴 7: `text: ` → `text:`
		fixed = fixed.replace(/`([^`\n]+?):\s*`/g, (match) => {
			count++;
			return match.replace(/`([^`\n]+?):\s*`/g, '`$1:`');
		});

		// 패턴 8: `text ` (콜론 없음) → `text`
		fixed = fixed.replace(/`([^`:\n]+?)\s+`/g, (match) => {
			count++;
			return match.replace(/`([^`:\n]+?)\s+`/g, '`$1`');
		});

		// 코드 블록 복원
		fixed = fixed.replace(/__CODE_BLOCK_(\d+)__/g, (match, index) => {
			return codeBlocks[parseInt(index)];
		});

		return { fixed, count };
	}
}
