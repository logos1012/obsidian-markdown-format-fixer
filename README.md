# Markdown Format Fixer

옵시디안에서 잘못된 마크다운 서식을 자동으로 수정해주는 플러그인입니다.

## 기능

띄어쓰기가 잘못 들어간 마크다운 기호를 올바른 형식으로 자동 변환합니다.

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
2. 현재 열린 파일의 서식이 자동으로 수정됩니다

### 방법 2: 명령어 팔레트
1. `Cmd/Ctrl + P` 눌러 명령어 팔레트 열기
2. "Fix Markdown Format" 입력 및 실행
3. 현재 열린 파일의 서식이 자동으로 수정됩니다

### 피드백
- 수정 완료 시: "✓ N개 항목이 수정되었습니다" 알림 표시
- 수정할 항목이 없을 시: "수정할 항목이 없습니다" 알림 표시

## 예외 처리

**코드 블록은 수정하지 않습니다:**
````markdown
```python
# 이 안의 *내용 *은 수정되지 않습니다
```
````

인라인 코드는 띄어쓰기만 제거됩니다.

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
