# CAD Quote Static V3 — 도면1.dxf 전용 검증 견적

## 실행 및 GitHub Pages 배포

`index.html`, `app.js`, `v3.js`, `style.css`, `drawing1-preview.svg`, `drawing1-analysis.json` 등 ZIP 내부 파일을 GitHub 저장소의 **최상위**에 업로드합니다. Settings → Pages → Deploy from a branch → main / (root). 예: https://duyeong625.github.io/v2/

로컬에서는 `python -m http.server 8080` 실행 후 http://localhost:8080 접속.

## 도면 실제 추출 결과

- DXF AC1027, INSUNITS=0 (단위 미지정)
- SPLINE 1,606개, DIMENSION 3개, 총 1,609개
- 실제 치수 객체 622, 547, 204 (사용자 확인: 깊이, 높이, 가로)
- 숨김 곡선 1,273개 / 보이는 곡선 333개
- 사용자 확정 재질 SUS304 2T, 수량 1, 레이저 절단+절곡
- SVG는 SPLINE을 근사한 **투상도 미리보기**로, 전개도나 절단 경로가 아닙니다.

## 견적 계산

사용자가 검증한 **전개 면적(mm²)**, **레이저 절단 길이(m)**, **절곡 횟수**, 자재/절단/절곡 단가를 입력해야 계산됩니다. 미입력 상태는 계산·저장을 차단합니다.

소재 중량(kg) = 전개 면적(mm²) × 2mm × 7930kg/m³ / 1e9. 자재비 = 중량 / 이용률 × 원/kg. 절단비 = m × 원/m. 절곡비 = 회 × 원/회. 총원가 = (자재비 + 절단비 + 절곡비 + 준비비) × (1+간접비율). 견적가 = 총원가 / (1-목표 매출총이익률). 부가세 제외.

블루시스템 연동은 **CSV 수동 업로드**이며 실제 API 직접 연동은 아닙니다. `material/kg`는 이름 또는 코드에 `SUS304`가 포함된 경우에만 자동 적용하고, `cutting/m`, `bending/ea`는 후보가 하나일 때만 자동 적용합니다.

견적 이력은 localStorage에 저장되므로 기기별 공유되지 않습니다. JSON 백업을 사용하세요. 공개 GitHub 저장소에 실제 기밀 도면이나 고객 단가를 올리지 마세요.

## 제한

- 이 도면은 Make2D 투상도이므로 외형 치수로 전개 면적을 산출하지 않습니다.
- 절곡선·절곡 횟수는 자동 확정되지 않습니다.
- DWG 직접 분석은 지원하지 않습니다. DXF는 Python ezdxf로 사전 분석하여 SVG/JSON으로 동봉했습니다.
- 기존 범용 DXF 업로드 분석기는 SPLINE을 직접 처리하지 않습니다.
- 정적 사이트는 인증·공용 DB가 없으며 실무 기밀 자료의 공개 배포에 적합하지 않습니다.
