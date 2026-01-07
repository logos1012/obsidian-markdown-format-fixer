/**
 * Claude API 테스트 스크립트
 * 사용법: CLAUDE_API_KEY=your-key node test-api.js
 */

const fs = require('fs');
const https = require('https');

const API_KEY = process.env.CLAUDE_API_KEY;

if (!API_KEY) {
    console.error('❌ CLAUDE_API_KEY 환경 변수를 설정해주세요');
    console.error('사용법: CLAUDE_API_KEY=sk-ant-xxx node test-api.js');
    process.exit(1);
}

// 테스트 파일 읽기
const inputFile = './tests/a.md';
const expectedFile = './tests/output.md';

const content = fs.readFileSync(inputFile, 'utf-8');
const expected = fs.readFileSync(expectedFile, 'utf-8');

console.log('📄 입력 파일:', inputFile);
console.log('📏 입력 크기:', content.length, '문자');
console.log('');

const systemPrompt = `옵시디안에서 읽을 마크다운 문서를 깔끔하게 정리해주세요.

문제: 볼드(**)나 이탤릭(*)처리에서 띄어쓰기가 잘못 들어가 서식이 제대로 작동하지 않습니다.
해결: 닫는 기호 앞의 불필요한 공백을 제거하고, 이탤릭은 볼드로 통일해주세요.

수정된 마크다운만 출력하세요. 설명 없이, 줄 구조 그대로 유지.`;

const requestBody = JSON.stringify({
    model: 'claude-3-haiku-20240307',
    max_tokens: 4096,
    system: systemPrompt,
    messages: [
        { role: 'user', content: content }
    ]
});

const options = {
    hostname: 'api.anthropic.com',
    path: '/v1/messages',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
        'anthropic-version': '2023-06-01',
        'Content-Length': Buffer.byteLength(requestBody)
    }
};

console.log('🤖 Claude API 호출 중...');
console.log('');

const req = https.request(options, (res) => {
    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        console.log('📡 응답 상태:', res.statusCode);
        console.log('');

        if (res.statusCode !== 200) {
            console.error('❌ API 오류:');
            console.error(data);
            process.exit(1);
        }

        try {
            const response = JSON.parse(data);

            // 응답 유효성 검사
            if (!response || !response.content || !Array.isArray(response.content) || response.content.length === 0) {
                console.error('❌ API 응답 형식이 올바르지 않습니다');
                console.error('응답:', JSON.stringify(response, null, 2));
                process.exit(1);
            }

            const textContent = response.content[0];
            if (!textContent || textContent.type !== 'text' || typeof textContent.text !== 'string') {
                console.error('❌ API 응답에서 텍스트를 찾을 수 없습니다');
                console.error('응답:', JSON.stringify(response, null, 2));
                process.exit(1);
            }

            const result = textContent.text;

            console.log('✅ API 호출 성공!');
            console.log('📏 결과 크기:', result.length, '문자');
            console.log('');

            // 결과 파일 저장
            const outputPath = './tests/result.md';
            fs.writeFileSync(outputPath, result, 'utf-8');
            console.log('💾 결과 저장:', outputPath);
            console.log('');

            // 기대 결과와 비교
            if (result.trim() === expected.trim()) {
                console.log('🎉 테스트 통과! 결과가 기대값과 일치합니다.');
            } else {
                console.log('⚠️  결과가 기대값과 다릅니다.');
                console.log('');

                // 차이점 분석
                const resultLines = result.trim().split('\n');
                const expectedLines = expected.trim().split('\n');

                console.log('📊 줄 수 비교:');
                console.log('   결과:', resultLines.length, '줄');
                console.log('   기대:', expectedLines.length, '줄');
                console.log('');

                // 처음 10개 차이점 출력
                let diffCount = 0;
                const maxDiffs = 10;

                for (let i = 0; i < Math.max(resultLines.length, expectedLines.length); i++) {
                    const resultLine = resultLines[i] || '(없음)';
                    const expectedLine = expectedLines[i] || '(없음)';

                    if (resultLine !== expectedLine && diffCount < maxDiffs) {
                        diffCount++;
                        console.log(`📍 ${i + 1}번째 줄 차이:`);
                        console.log(`   결과: ${resultLine.substring(0, 80)}${resultLine.length > 80 ? '...' : ''}`);
                        console.log(`   기대: ${expectedLine.substring(0, 80)}${expectedLine.length > 80 ? '...' : ''}`);
                        console.log('');
                    }
                }

                if (diffCount === 0) {
                    console.log('(공백/줄바꿈 차이만 있음)');
                }
            }

            // 사용량 정보
            if (response.usage) {
                console.log('');
                console.log('📈 토큰 사용량:');
                console.log('   입력:', response.usage.input_tokens);
                console.log('   출력:', response.usage.output_tokens);
            }

        } catch (e) {
            console.error('❌ JSON 파싱 오류:', e.message);
            console.error('원본 응답:', data);
            process.exit(1);
        }
    });
});

req.on('error', (e) => {
    console.error('❌ 요청 오류:', e.message);
    process.exit(1);
});

req.write(requestBody);
req.end();
