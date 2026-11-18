# CAD 자동 견적 Static V1

## 배포

이 폴더의 `index.html`, `app.js`, `style.css`를 GitHub Pages 또는 Cloudflare Pages에 그대로 올리면 됩니다. 빌드 명령은 필요하지 않습니다.

로컬 미리보기:

```bash
python -m http.server 8080
```

브라우저에서 `http://localhost:8080` 접속.

## 제공 기능
- ASCII DXF의 LINE/LWPOLYLINE/CIRCLE/ARC/TEXT/MTEXT 객체 수 집계, 선·원 미리보기, 좌표 범위 추출
- PDF 브라우저 미리보기
- 판재/형강/파이프 자재비·절단비·기타 가공비·간접비·이윤율 계산
- CSV 단가 가져오기 및 일부 단가 항목 수동 적용
- 브라우저 localStorage 견적 이력, JSON 백업·복원

## 제한 및 주의
- **DWG 자동 분석 불가**: 별도 CAD에서 ASCII DXF로 변환해야 함
- PDF **자동 치수 추출 불가**: 미리보기만 제공
- DXF 좌표의 단위를 확인하지 않으며, 블록 INSERT, SPLINE, bulge, 원호 시각화, 복합 형상 면적, 홀 판정, 자동 재질 판정 미지원
- 추출된 범위는 도면 전체 객체의 bounding box이므로 실제 부품 치수와 다를 수 있음
- CSV 파일은 실제 블루시스템 API 연동이 아닌 수동 가져오기 방식임
- localStorage는 사용자/브라우저마다 별도이며 데이터가 삭제될 수 있음. 민감한 데이터나 공동 사용 업무에는 적합하지 않음
- 로그인, 공유 DB, 사용자별 권한, 승인 이력, 서버 측 백업, 실제 Excel/PDF 견적서 출력 없음
- 원가 계산은 참고용이며 구매 규격, 네스팅, 실제 가공 시간, VAT 등을 포함하지 않음

## 단가 CSV 열
`external_code,name,category,unit,unit_price,effective_date`

예: `MAT-SS400,SS400 자재비,material,kg,1500,2026-11-18`

## GitHub Pages
1. GitHub 저장소 생성 후 파일 3개 업로드
2. Settings → Pages → Build and deployment → Deploy from a branch
3. Branch `main`, Folder `/ (root)` 선택 및 저장
4. 제공된 `https://<username>.github.io/<repository>/` URL로 접속

## Cloudflare Pages
Cloudflare Pages에서 새 프로젝트 생성 후 정적 파일 폴더를 Direct Upload로 배포. 사이트가 외부에 공개될 수 있으므로 견적 자료 취급에 유의.
