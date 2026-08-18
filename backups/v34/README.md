# 콕매치 v34 핵심 백업

v35 다중모임 구조 전환 직전의 복구 지점입니다.

- Git 브랜치: `backup/v34`
- 실행 가능한 프론트 보관본: `/legacy-v34/index.html`
- 버전 보관함 진입: `/versions/v34/index.html`
- DB 상태 스냅샷: `kokmatch_v34_state_backup`
- 역할 PIN 스냅샷: `kokmatch_v34_member_auth_backup`
- 구형 공용 PIN 스냅샷: `kokmatch_v34_auth_backup`
- 기존 v34 Edge Functions는 삭제/덮어쓰기하지 않고 유지
- v35는 별도 `kokmatch-multi-api`를 사용

주의: v34 실행본을 단순 열어보는 것과 DB 전체를 v34 시점으로 복구하는 것은 다릅니다. 실제 롤백이 필요하면 프론트 브랜치와 DB 스냅샷을 함께 기준으로 복구합니다.
