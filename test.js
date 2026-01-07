// Quick test script for the fixPatterns logic
const fs = require('fs');

function fixPatterns(content) {
	let fixed = content;
	let count = 0;

	// 코드 블록을 임시로 보호
	const codeBlocks = [];
	fixed = fixed.replace(/```[\s\S]*?```/g, (match) => {
		codeBlocks.push(match);
		return `__CODE_BLOCK_${codeBlocks.length - 1}__`;
	});

	// 패턴 5: **text: ** → **text:** (먼저 처리)
	fixed = fixed.replace(/\*\*([^*\n]+?):\s+\*\*/g, (match, p1) => {
		count++;
		return `**${p1}:**`;
	});

	// 패턴 6: **text ** (콜론 없음) → **text**
	fixed = fixed.replace(/\*\*([^*:\n]+?)\s+\*\*/g, (match, p1) => {
		count++;
		return `**${p1}**`;
	});

	// 패턴 1: *text: * → **text:** (single asterisk, not preceded by *)
	fixed = fixed.replace(/(?<!\*)\*([^*\n]+?):\s+\*(?!\*)/g, (match, p1) => {
		count++;
		return `**${p1}:**`;
	});

	// 패턴 2: *text * (콜론 없음, single asterisk)
	fixed = fixed.replace(/(?<!\*)\*([^*:\n]+?)\s+\*(?!\*)/g, (match, p1) => {
		count++;
		return `**${p1}**`;
	});

	// 패턴 3: _text: _ → **text:**
	fixed = fixed.replace(/_([^_\n]+?):\s*_/g, (match, p1) => {
		count++;
		return `**${p1}:**`;
	});

	// 패턴 4: _text _ (콜론 없음) → **text**
	fixed = fixed.replace(/_([^_:\n]+?)\s+_/g, (match, p1) => {
		count++;
		return `**${p1}**`;
	});

	// 패턴 7: `text: ` → `text:`
	fixed = fixed.replace(/`([^`\n]+?):\s*`/g, (match, p1) => {
		count++;
		return `\`${p1}:\``;
	});

	// 패턴 8: `text ` (콜론 없음) → `text`
	fixed = fixed.replace(/`([^`:\n]+?)\s+`/g, (match, p1) => {
		count++;
		return `\`${p1}\``;
	});

	// 코드 블록 복원
	fixed = fixed.replace(/__CODE_BLOCK_(\d+)__/g, (match, index) => {
		return codeBlocks[parseInt(index)];
	});

	return { fixed, count };
}

// Test with a.md
const input = fs.readFileSync('tests/a.md', 'utf8');
const result = fixPatterns(input);

console.log('Count:', result.count);
fs.writeFileSync('tests/output.md', result.fixed);
console.log('Output written to tests/output.md');
