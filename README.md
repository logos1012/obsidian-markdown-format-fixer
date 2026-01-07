# Markdown Format Fixer

Claude AI를 사용하여 옵시디안에서 잘못된 마크다운 서식을 자동으로 수정해주는 플러그인입니다.

## 기능

Claude Sonnet 4 API를 사용하여 띄어쓰기가 잘못 들어간 마크다운 기호를 올바른 형식으로 자동 변환합니다.

### 주요 특징

**🤖 강력한 AI 기반 수정**
- Claude Sonnet 4의 뛰어난 텍스트 이해력
- 문맥을 고려한 지능적 서식 수정
- 정규식으로는 처리하기 어려운 복잡한 패턴 처리

**💰 비용 투명성**
- 작업 실행 전 예상 토큰 사용량 표시
- 실시간 비용 계산 (USD 및 KRW)
- 사용자 확인 후 진행으로 예상치 못한 비용 방지

### 왜 Claude AI인가요?

정규식 방식의 한계를 극복하기 위해 Claude AI를 사용합니다:
- 복잡한 패턴도 정확하게 인식
- 문맥을 고려한 지능적 수정
- 예상치 못한 엣지 케이스 처리

### 수정 패턴

| 잘못된 형식 | 올바른 형식 |
|---|---|
| `*text: *` | `**text:**` |
| `*text *` | `**text**` |
| `_text: _` | `**text:**` |
| `_text _` | `**text**` |
| `**text: **` | `**text:**` |
| `**text **` | `**text**` |
| `` `text: ` `` | `` `text:` `` |
| `` `text ` `` | `` `text` `` |

### 예시

**변환 전:**
```markdown
**조사 대상 커뮤니티: **Reddit r/ObsidianMD

*핵심 니즈: *연결의 개념적 이해
*강의 대응: *실제 사례로 비교
```

**변환 후:**
```markdown
**조사 대상 커뮤니티:** Reddit r/ObsidianMD

**핵심 니즈:** 연결의 개념적 이해
**강의 대응:** 실제 사례로 비교
```

## 사용 방법

### 방법 1: 리본 아이콘
1. 왼쪽 사이드바에서 지팡이 아이콘(🪄) 클릭
2. 토큰 사용량 및 비용 확인 팝업이 표시됩니다
3. "계속 진행" 버튼을 클릭하여 수정 진행
4. 현재 열린 파일의 서식이 자동으로 수정됩니다

### 방법 2: 명령어 팔레트
1. `Cmd/Ctrl + P` 눌러 명령어 팔레트 열기
2. "Fix Markdown Format" 입력 및 실행
3. 토큰 사용량 및 비용 확인 팝업이 표시됩니다
4. "계속 진행" 버튼을 클릭하여 수정 진행
5. 현재 열린 파일의 서식이 자동으로 수정됩니다

### 토큰 사용량 표시

작업 실행 전 다음 정보가 표시됩니다:
- 📥 예상 입력 토큰
- 📤 예상 출력 토큰
- 📊 총 토큰
- 💰 예상 비용 (USD 및 KRW)

이를 통해 API 사용 비용을 미리 확인하고 결정할 수 있습니다.

### 피드백
- 수정 완료 시: "✓ 마크다운 서식이 수정되었습니다" 알림 표시
- 수정할 항목이 없을 시: "수정할 항목이 없습니다" 알림 표시
- 작업 취소 시: "작업이 취소되었습니다" 알림 표시

## 예외 처리

**코드 블록은 수정하지 않습니다:**
````markdown
```python
# 이 안의 *내용 *은 수정되지 않습니다
```
````

인라인 코드는 띄어쓰기만 제거됩니다.

## 설정

### 1. Claude API 키 발급
1. [Anthropic Console](https://console.anthropic.com/)에 접속
2. API Keys 메뉴에서 새 API 키 생성
3. 생성된 키 복사 (sk-ant-로 시작)

### 2. 플러그인 설정
1. 옵시디안 설정 → 커뮤니티 플러그인 → Markdown Format Fixer
2. Claude API Key 입력란에 발급받은 키 붙여넣기
3. 설정 저장

## 설치 방법

### BRAT으로 설치 (권장)
1. [BRAT 플러그인](https://github.com/TfTHacker/obsidian42-brat) 설치
2. BRAT 설정에서 "Add Beta plugin" 클릭
3. 다음 URL 입력:
   ```
   logos1012/obsidian-markdown-format-fixer
   ```
4. 옵시디안 설정 → 커뮤니티 플러그인 → "Markdown Format Fixer" 활성화

### 수동 설치
1. [최신 릴리즈](https://github.com/logos1012/obsidian-markdown-format-fixer/releases) 다운로드
2. `manifest.json`, `main.js`를 옵시디안 vault의 `.obsidian/plugins/markdown-format-fixer/` 폴더에 복사
3. 옵시디안 설정 → 커뮤니티 플러그인 → "Markdown Format Fixer" 활성화

### 개발자용
```bash
git clone https://github.com/logos1012/obsidian-markdown-format-fixer.git
cd obsidian-markdown-format-fixer
npm install
npm run build
```

## 라이선스
MIT

## 제작자
[Workbetterlife](https://workbetterlife.com)

---

**피드백 및 버그 리포트 환영합니다!**
