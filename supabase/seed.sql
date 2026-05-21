-- ============================================
-- 초기 데이터 시드
-- ============================================

-- 부서
insert into departments (name) values ('(주)승산팩') on conflict (name) do nothing;
insert into departments (name) values ('관리부') on conflict (name) do nothing;
insert into departments (name) values ('박스생산부') on conflict (name) do nothing;
insert into departments (name) values ('스틸생산부') on conflict (name) do nothing;
insert into departments (name) values ('용성CY') on conflict (name) do nothing;

-- 근로자
with d as (select id, name from departments)
insert into workers (name, department_id, is_foreign) values
  ('강세원', (select id from d where name='용성CY'), false),
  ('김권민', (select id from d where name='박스생산부'), false),
  ('김대훈', (select id from d where name='스틸생산부'), false),
  ('김도원', (select id from d where name='스틸생산부'), false),
  ('김병철', (select id from d where name='박스생산부'), false),
  ('김진우', null, false),
  ('김찬호', (select id from d where name='스틸생산부'), false),
  ('김효동', (select id from d where name='스틸생산부'), false),
  ('김흥', (select id from d where name='박스생산부'), false),
  ('나타왓', (select id from d where name='스틸생산부'), false),
  ('능롬', (select id from d where name='박스생산부'), true),
  ('다나톤', (select id from d where name='스틸생산부'), true),
  ('다난제이', (select id from d where name='스틸생산부'), true),
  ('다린두', (select id from d where name='스틸생산부'), true),
  ('다어쥐용옥', null, true),
  ('듄', (select id from d where name='스틸생산부'), true),
  ('레보라', (select id from d where name='박스생산부'), true),
  ('렛사라스', null, true),
  ('리스', (select id from d where name='(주)승산팩'), true),
  ('마두한사', (select id from d where name='스틸생산부'), true),
  ('마카라', null, true),
  ('박지우', (select id from d where name='(주)승산팩'), false),
  ('반넷', (select id from d where name='스틸생산부'), true),
  ('백민숙', null, false),
  ('밴래트한', (select id from d where name='스틸생산부'), true),
  ('사디라리', (select id from d where name='(주)승산팩'), true),
  ('사렛', (select id from d where name='스틸생산부'), true),
  ('사콘', (select id from d where name='스틸생산부'), true),
  ('산티', null, true),
  ('삼바트', (select id from d where name='스틸생산부'), true),
  ('샤논', (select id from d where name='스틸생산부'), true),
  ('샤흐조드', (select id from d where name='스틸생산부'), true),
  ('서동빈', (select id from d where name='(주)승산팩'), false),
  ('서성규', null, false),
  ('소파오', (select id from d where name='(주)승산팩'), false),
  ('시라제딘', (select id from d where name='(주)승산팩'), true),
  ('신선도', (select id from d where name='스틸생산부'), false),
  ('신승호', null, false),
  ('심승', null, false),
  ('심현섭', (select id from d where name='(주)승산팩'), false),
  ('싸원', (select id from d where name='스틸생산부'), true),
  ('쏨피아', (select id from d where name='스틸생산부'), true),
  ('아지즈벡', (select id from d where name='스틸생산부'), true),
  ('양롱', (select id from d where name='스틸생산부'), false),
  ('양성경', null, false),
  ('우롬', (select id from d where name='스틸생산부'), false),
  ('원충효', null, false),
  ('웨이웃타나폰', null, true),
  ('유기모', null, false),
  ('윤수현', (select id from d where name='박스생산부'), false),
  ('윤훈재', (select id from d where name='(주)승산팩'), false),
  ('이금호', (select id from d where name='스틸생산부'), false),
  ('이승정', null, false),
  ('이양화', (select id from d where name='스틸생산부'), false),
  ('이우봉', (select id from d where name='스틸생산부'), false),
  ('이재환', (select id from d where name='스틸생산부'), false),
  ('이준병', (select id from d where name='스틸생산부'), false),
  ('이초희', (select id from d where name='관리부'), false),
  ('임채승', (select id from d where name='스틸생산부'), false),
  ('진피에룬', (select id from d where name='스틸생산부'), false),
  ('차도환', (select id from d where name='스틸생산부'), false),
  ('칭마이', (select id from d where name='스틸생산부'), true),
  ('티찬타', (select id from d where name='스틸생산부'), true),
  ('포핀', (select id from d where name='스틸생산부'), true),
  ('퐁', null, true),
  ('피에르', (select id from d where name='박스생산부'), true),
  ('홍길현', (select id from d where name='박스생산부'), false)
on conflict do nothing;

-- 검진 기록
insert into examinations (worker_id, exam_date, exam_form, exam_kind, exam_category, factors_raw, cycle_months) values ((select id from workers where name='김권민' limit 1), '2024-01-02', '내원검진', '배치전검진', '배치전', '소음(배치전)(배)+톨루엔(채용)(배)', 12);
insert into examinations (worker_id, exam_date, exam_form, exam_kind, exam_category, factors_raw, cycle_months) values ((select id from workers where name='차도환' limit 1), '2024-01-05', '내원검진', '배치후검진', '배치후', '2-부톡시에탄올(배)+구리(배)+기타광물성분진(배)+망간(배)+메틸에틸케톤(배)+메틸이소부틸케톤(배)+미네랄오일미스트(배)+산화철(배)+소음(배치후)(배)+아세톤(배)+알루미늄(배)+용접흄(배)+유리섬유분진(배)+이소프로필알코올(배)+자외선(배)+지르코니움(배)+진동(배)+크실렌(배)+톨루엔(배)', 12);
insert into examinations (worker_id, exam_date, exam_form, exam_kind, exam_category, factors_raw, cycle_months) values ((select id from workers where name='나타왓' limit 1), '2024-01-12', '내원검진', '배치전검진', '배치전', '2-부톡시에탄올(배)+구리(배)+기타광물성분진(배)+망간(배)+메틸에틸케톤(배)+메틸이소부틸케톤(배)+미네랄오일미스트(배)+산화알루미늄(배)+산화철(배)+소음(배치전)(배)+아세톤(배)+알루미늄(배)+용접흄(배)+유리섬유분진(배)+유해광선(마이크로파 및 라디오파)(배)+이소프로필알코올(배)+자외선(배)+지르코니움(배)+진동(배)+크실렌(채용)(배)+톨루엔(채용)(배)', 12);
insert into examinations (worker_id, exam_date, exam_form, exam_kind, exam_category, factors_raw, cycle_months) values ((select id from workers where name='듄' limit 1), '2024-01-12', '내원검진', '배치전검진', '배치전', '2-부톡시에탄올(배)+구리(배)+기타광물성분진(배)+망간(배)+메틸에틸케톤(배)+메틸이소부틸케톤(배)+미네랄오일미스트(배)+산화알루미늄(배)+산화철(배)+소음(배치전)(배)+아세톤(배)+알루미늄(배)+용접흄(배)+유리섬유분진(배)+유해광선(마이크로파 및 라디오파)(배)+이소프로필알코올(배)+자외선(배)+지르코니움(배)+진동(배)+크실렌(채용)(배)+톨루엔(채용)(배)', 12);
insert into examinations (worker_id, exam_date, exam_form, exam_kind, exam_category, factors_raw, cycle_months) values ((select id from workers where name='샤논' limit 1), '2024-01-12', '내원검진', '배치전검진', '배치전', '2-부톡시에탄올(배)+구리(배)+기타광물성분진(배)+망간(배)+메틸에틸케톤(배)+메틸이소부틸케톤(배)+미네랄오일미스트(배)+산화알루미늄(배)+산화철(배)+소음(배치전)(배)+아세톤(배)+알루미늄(배)+용접흄(배)+유리섬유분진(배)+유해광선(마이크로파 및 라디오파)(배)+이소프로필알코올(배)+자외선(배)+지르코니움(배)+진동(배)+크실렌(채용)(배)+톨루엔(채용)(배)', 12);
insert into examinations (worker_id, exam_date, exam_form, exam_kind, exam_category, factors_raw, cycle_months) values ((select id from workers where name='티찬타' limit 1), '2024-01-12', '내원검진', '배치전검진', '배치전', '2-부톡시에탄올(배)+구리(배)+기타광물성분진(배)+망간(배)+메틸에틸케톤(배)+메틸이소부틸케톤(배)+미네랄오일미스트(배)+산화알루미늄(배)+산화철(배)+소음(배치전)(배)+아세톤(배)+알루미늄(배)+용접흄(배)+유리섬유분진(배)+유해광선(마이크로파 및 라디오파)(배)+이소프로필알코올(배)+자외선(배)+지르코니움(배)+진동(배)+크실렌(채용)(배)+톨루엔(채용)(배)', 12);
insert into examinations (worker_id, exam_date, exam_form, exam_kind, exam_category, factors_raw, cycle_months) values ((select id from workers where name='강세원' limit 1), '2024-01-15', '내원검진', '배치전검진', '배치전', '소음(배치전)(배)+톨루엔(채용)(배)', 12);
insert into examinations (worker_id, exam_date, exam_form, exam_kind, exam_category, factors_raw, cycle_months) values ((select id from workers where name='서성규' limit 1), '2024-01-22', '내원검진', '기타검진', '기타', '운전면허-1종적성(기)', NULL);
insert into examinations (worker_id, exam_date, exam_form, exam_kind, exam_category, factors_raw, cycle_months) values ((select id from workers where name='레보라' limit 1), '2024-02-06', '내원검진', '배치전검진', '배치전', '소음(배치전)(배)+톨루엔(채용)(배)', 12);
insert into examinations (worker_id, exam_date, exam_form, exam_kind, exam_category, factors_raw, cycle_months) values ((select id from workers where name='피에르' limit 1), '2024-02-06', '내원검진', '배치전검진', '배치전', '소음(배치전)(배)+톨루엔(채용)(배)', 12);
insert into examinations (worker_id, exam_date, exam_form, exam_kind, exam_category, factors_raw, cycle_months) values ((select id from workers where name='심현섭' limit 1), '2024-03-08', '내원검진', '배치전검진', '배치전', '2-부톡시에탄올(배)+구리(배)+기타광물성분진(배)+망간(배)+메틸에틸케톤(배)+메틸이소부틸케톤(배)+미네랄오일미스트(배)+산화철(배)+소음(배치전)(배)+아세톤(배)+알루미늄(배)+용접흄(배)+유리섬유분진(배)+유해광선(마이크로파 및 라디오파)(배)+이소프로필알코올(배)+자외선(배)+지르코니움(배)+진동(배)+크실렌(채용)(배)+톨루엔(채용)(배)', 12);
insert into examinations (worker_id, exam_date, exam_form, exam_kind, exam_category, factors_raw, cycle_months) values ((select id from workers where name='사디라리' limit 1), '2024-03-12', '내원검진', '배치전검진', '배치전', '2-부톡시에탄올(배)+구리(배)+기타광물성분진(배)+망간(배)+메틸에틸케톤(배)+메틸이소부틸케톤(배)+미네랄오일미스트(배)+산화철(배)+소음(배치전)(배)+아세톤(배)+알루미늄(배)+용접흄(배)+유리섬유분진(배)+유해광선(마이크로파 및 라디오파)(배)+이소프로필알코올(배)+자외선(배)+지르코니움(배)+진동(배)+크실렌(채용)(배)+톨루엔(채용)(배)', 12);
insert into examinations (worker_id, exam_date, exam_form, exam_kind, exam_category, factors_raw, cycle_months) values ((select id from workers where name='시라제딘' limit 1), '2024-03-12', '내원검진', '배치전검진', '배치전', '2-부톡시에탄올(배)+구리(배)+기타광물성분진(배)+망간(배)+메틸에틸케톤(배)+메틸이소부틸케톤(배)+미네랄오일미스트(배)+산화철(배)+소음(배치전)(배)+아세톤(배)+알루미늄(배)+용접흄(배)+유리섬유분진(배)+유해광선(마이크로파 및 라디오파)(배)+이소프로필알코올(배)+자외선(배)+지르코니움(배)+진동(배)+크실렌(채용)(배)+톨루엔(채용)(배)', 12);
insert into examinations (worker_id, exam_date, exam_form, exam_kind, exam_category, factors_raw, cycle_months) values ((select id from workers where name='마두한사' limit 1), '2024-03-29', '내원검진', '배치전검진', '배치전', '2-부톡시에탄올(배)+구리(배)+기타광물성분진(배)+망간(배)+메틸에틸케톤(배)+메틸이소부틸케톤(배)+미네랄오일미스트(배)+산화철(배)+소음(배치전)(배)+아세톤(배)+알루미늄(배)+용접흄(배)+유리섬유분진(배)+유해광선(마이크로파 및 라디오파)(배)+이소프로필알코올(배)+자외선(배)+지르코니움(배)+진동(배)+크실렌(채용)(배)+톨루엔(채용)(배)', 12);
insert into examinations (worker_id, exam_date, exam_form, exam_kind, exam_category, factors_raw, cycle_months) values ((select id from workers where name='샤흐조드' limit 1), '2024-03-29', '내원검진', '배치전검진', '배치전', '2-부톡시에탄올(배)+구리(배)+기타광물성분진(배)+망간(배)+메틸에틸케톤(배)+메틸이소부틸케톤(배)+미네랄오일미스트(배)+산화철(배)+소음(배치전)(배)+아세톤(배)+알루미늄(배)+용접흄(배)+유리섬유분진(배)+유해광선(마이크로파 및 라디오파)(배)+이소프로필알코올(배)+자외선(배)+지르코니움(배)+진동(배)+크실렌(채용)(배)+톨루엔(채용)(배)', 12);
insert into examinations (worker_id, exam_date, exam_form, exam_kind, exam_category, factors_raw, cycle_months) values ((select id from workers where name='아지즈벡' limit 1), '2024-03-29', '내원검진', '배치전검진', '배치전', '2-부톡시에탄올(배)+구리(배)+기타광물성분진(배)+망간(배)+메틸에틸케톤(배)+메틸이소부틸케톤(배)+미네랄오일미스트(배)+산화철(배)+소음(배치전)(배)+아세톤(배)+알루미늄(배)+용접흄(배)+유리섬유분진(배)+유해광선(마이크로파 및 라디오파)(배)+이소프로필알코올(배)+자외선(배)+지르코니움(배)+진동(배)+크실렌(채용)(배)+톨루엔(채용)(배)', 12);
insert into examinations (worker_id, exam_date, exam_form, exam_kind, exam_category, factors_raw, cycle_months) values ((select id from workers where name='포핀' limit 1), '2024-03-29', '내원검진', '배치전검진', '배치전', '2-부톡시에탄올(배)+구리(배)+기타광물성분진(배)+망간(배)+메틸에틸케톤(배)+메틸이소부틸케톤(배)+미네랄오일미스트(배)+산화철(배)+소음(배치전)(배)+아세톤(배)+알루미늄(배)+용접흄(배)+유리섬유분진(배)+유해광선(마이크로파 및 라디오파)(배)+이소프로필알코올(배)+자외선(배)+지르코니움(배)+진동(배)+크실렌(채용)(배)+톨루엔(채용)(배)', 12);
insert into examinations (worker_id, exam_date, exam_form, exam_kind, exam_category, factors_raw, cycle_months) values ((select id from workers where name='김대훈' limit 1), '2024-04-16', '내원검진', '배치전검진', '배치전', '2-부톡시에탄올(배)+구리(배)+기타광물성분진(배)+망간(배)+메틸에틸케톤(배)+메틸이소부틸케톤(배)+미네랄오일미스트(배)+산화철(배)+소음(배치전)(배)+아세톤(배)+알루미늄(배)+용접흄(배)+유리섬유분진(배)+이소프로필알코올(배)+자외선(배)+지르코니움(배)+진동(배)+크실렌(채용)(배)+톨루엔(채용)(배)', 12);
insert into examinations (worker_id, exam_date, exam_form, exam_kind, exam_category, factors_raw, cycle_months) values ((select id from workers where name='다린두' limit 1), '2024-04-19', '내원검진', '배치전검진', '배치전', '2-부톡시에탄올(배)+구리(배)+기타광물성분진(배)+망간(배)+메틸에틸케톤(배)+메틸이소부틸케톤(배)+미네랄오일미스트(배)+산화철(배)+소음(배치전)(배)+아세톤(배)+알루미늄(배)+용접흄(배)+유리섬유분진(배)+유해광선(마이크로파 및 라디오파)(배)+이소프로필알코올(배)+자외선(배)+지르코니움(배)+진동(배)+크실렌(채용)(배)+톨루엔(채용)(배)', 12);
insert into examinations (worker_id, exam_date, exam_form, exam_kind, exam_category, factors_raw, cycle_months) values ((select id from workers where name='싸원' limit 1), '2024-04-19', '내원검진', '배치전검진', '배치전', '2-부톡시에탄올(배)+구리(배)+기타광물성분진(배)+망간(배)+메틸에틸케톤(배)+메틸이소부틸케톤(배)+미네랄오일미스트(배)+산화철(배)+소음(배치전)(배)+아세톤(배)+알루미늄(배)+용접흄(배)+유리섬유분진(배)+유해광선(마이크로파 및 라디오파)(배)+이소프로필알코올(배)+자외선(배)+지르코니움(배)+진동(배)+크실렌(채용)(배)+톨루엔(채용)(배)', 12);
insert into examinations (worker_id, exam_date, exam_form, exam_kind, exam_category, factors_raw, cycle_months) values ((select id from workers where name='서동빈' limit 1), '2024-05-27', '내원검진', '배치전검진', '배치전', '2-부톡시에탄올(배)+구리(배)+기타광물성분진(배)+망간(배)+메틸에틸케톤(배)+메틸이소부틸케톤(배)+미네랄오일미스트(배)+산화철(배)+소음(배치전)(배)+아세톤(배)+알루미늄(배)+용접흄(배)+유리섬유분진(배)+이소프로필알코올(배)+자외선(배)+지르코니움(배)+진동(배)+크실렌(채용)(배)+톨루엔(채용)(배)', 12);
insert into examinations (worker_id, exam_date, exam_form, exam_kind, exam_category, factors_raw, cycle_months) values ((select id from workers where name='리스' limit 1), '2024-07-22', '내원검진', '배치전검진', '배치전', '2-부톡시에탄올(배)+구리(배)+기타광물성분진(배)+망간(배)+메틸에틸케톤(배)+메틸이소부틸케톤(배)+미네랄오일미스트(배)+산화철(배)+소음(배치전)(배)+아세톤(배)+알루미늄(배)+용접흄(배)+유리섬유분진(배)+이소프로필알코올(배)+자외선(배)+지르코니움(배)+진동(배)+크실렌(채용)(배)+톨루엔(채용)(배)', 12);
insert into examinations (worker_id, exam_date, exam_form, exam_kind, exam_category, factors_raw, cycle_months) values ((select id from workers where name='소파오' limit 1), '2024-07-22', '내원검진', '배치전검진', '배치전', '2-부톡시에탄올(배)+구리(배)+기타광물성분진(배)+망간(배)+메틸에틸케톤(배)+메틸이소부틸케톤(배)+미네랄오일미스트(배)+산화철(배)+소음(배치전)(배)+아세톤(배)+알루미늄(배)+용접흄(배)+유리섬유분진(배)+이소프로필알코올(배)+자외선(배)+지르코니움(배)+진동(배)+크실렌(채용)(배)+톨루엔(채용)(배)', 12);
insert into examinations (worker_id, exam_date, exam_form, exam_kind, exam_category, factors_raw, cycle_months) values ((select id from workers where name='이금호' limit 1), '2024-07-25', '내원검진', '특수검진', '일반+특수', '일반검진(일)+2-부톡시에탄올(특)+구리(특)+기타광물성분진(특)+망간(특)+메틸에틸케톤(특)+메틸이소부틸케톤(특)+미네랄오일미스트(특)+산화철(특)+소음(특)+아세톤(특)+알루미늄(특)+용접흄(특)+유리섬유분진(특)+이소프로필알코올(특)+자외선(특)+지르코니움(특)+진동(특)+크실렌(특)+톨루엔(특)', 12);
insert into examinations (worker_id, exam_date, exam_form, exam_kind, exam_category, factors_raw, cycle_months) values ((select id from workers where name='이양화' limit 1), '2024-08-02', '내원검진', '특수검진', '일반+특수', '일반검진(일)+2-부톡시에탄올(특)+구리(특)+기타광물성분진(특)+망간(특)+메틸에틸케톤(특)+메틸이소부틸케톤(특)+미네랄오일미스트(특)+산화철(특)+소음(특)+아세톤(특)+알루미늄(특)+용접흄(특)+유리섬유분진(특)+이소프로필알코올(특)+자외선(특)+지르코니움(특)+진동(특)+크실렌(특)+톨루엔(특)', 12);
insert into examinations (worker_id, exam_date, exam_form, exam_kind, exam_category, factors_raw, cycle_months) values ((select id from workers where name='다나톤' limit 1), '2024-08-07', '내원검진', '배치전검진', '배치전', '2-부톡시에탄올(배)+구리(배)+기타광물성분진(배)+망간(배)+메틸에틸케톤(배)+메틸이소부틸케톤(배)+미네랄오일미스트(배)+산화철(배)+소음(배치전)(배)+아세톤(배)+알루미늄(배)+용접흄(배)+유리섬유분진(배)+이소프로필알코올(배)+자외선(배)+지르코니움(배)+진동(배)+크실렌(채용)(배)+톨루엔(채용)(배)', 12);
insert into examinations (worker_id, exam_date, exam_form, exam_kind, exam_category, factors_raw, cycle_months) values ((select id from workers where name='다난제이' limit 1), '2024-08-07', '내원검진', '배치전검진', '배치전', '2-부톡시에탄올(배)+구리(배)+기타광물성분진(배)+망간(배)+메틸에틸케톤(배)+메틸이소부틸케톤(배)+미네랄오일미스트(배)+산화철(배)+소음(배치전)(배)+아세톤(배)+알루미늄(배)+용접흄(배)+유리섬유분진(배)+이소프로필알코올(배)+자외선(배)+지르코니움(배)+진동(배)+크실렌(채용)(배)+톨루엔(채용)(배)', 12);
insert into examinations (worker_id, exam_date, exam_form, exam_kind, exam_category, factors_raw, cycle_months) values ((select id from workers where name='김찬호' limit 1), '2024-08-08', '내원검진', '특수검진', '일반+특수', '이상지질혈증(일)+일반검진(일)+2-부톡시에탄올(특)+구리(특)+기타광물성분진(특)+망간(특)+메틸에틸케톤(특)+메틸이소부틸케톤(특)+미네랄오일미스트(특)+산화철(특)+소음(특)+아세톤(특)+알루미늄(특)+용접흄(특)+유리섬유분진(특)+이소프로필알코올(특)+자외선(특)+지르코니움(특)+진동(특)+크실렌(특)+톨루엔(특)', 12);
insert into examinations (worker_id, exam_date, exam_form, exam_kind, exam_category, factors_raw, cycle_months) values ((select id from workers where name='차도환' limit 1), '2024-08-08', '내원검진', '특수검진', '일반+특수', '일반검진(일)+2-부톡시에탄올(특)+구리(특)+기타광물성분진(특)+망간(특)+메틸에틸케톤(특)+메틸이소부틸케톤(특)+미네랄오일미스트(특)+산화철(특)+소음(특)+아세톤(특)+알루미늄(특)+용접흄(특)+유리섬유분진(특)+이소프로필알코올(특)+자외선(특)+지르코니움(특)+진동(특)+크실렌(특)+톨루엔(특)', 12);
insert into examinations (worker_id, exam_date, exam_form, exam_kind, exam_category, factors_raw, cycle_months) values ((select id from workers where name='이준병' limit 1), '2024-08-21', '내원검진', '특수검진', '일반+특수', '일반검진(일)+2-부톡시에탄올(특)+구리(특)+기타광물성분진(특)+망간(특)+메틸에틸케톤(특)+메틸이소부틸케톤(특)+미네랄오일미스트(특)+산화철(특)+소음(특)+아세톤(특)+알루미늄(특)+용접흄(특)+유리섬유분진(특)+이소프로필알코올(특)+자외선(특)+지르코니움(특)+진동(특)+크실렌(특)+톨루엔(특)', 12);
insert into examinations (worker_id, exam_date, exam_form, exam_kind, exam_category, factors_raw, cycle_months) values ((select id from workers where name='김효동' limit 1), '2024-08-29', '내원검진', '특수검진', '일반+특수', '이상지질혈증(일)+일반검진(일)+2-부톡시에탄올(특)+구리(특)+기타광물성분진(특)+망간(특)+메틸에틸케톤(특)+메틸이소부틸케톤(특)+미네랄오일미스트(특)+산화철(특)+소음(특)+아세톤(특)+알루미늄(특)+용접흄(특)+유리섬유분진(특)+이소프로필알코올(특)+자외선(특)+지르코니움(특)+진동(특)+크실렌(특)+톨루엔(특)', 12);
insert into examinations (worker_id, exam_date, exam_form, exam_kind, exam_category, factors_raw, cycle_months) values ((select id from workers where name='임채승' limit 1), '2024-08-29', '내원검진', '특수검진', '일반+특수', '우울증(일)+일반검진(일)+2-부톡시에탄올(특)+구리(특)+기타광물성분진(특)+망간(특)+메틸에틸케톤(특)+메틸이소부틸케톤(특)+미네랄오일미스트(특)+산화철(특)+소음(특)+아세톤(특)+알루미늄(특)+용접흄(특)+유리섬유분진(특)+이소프로필알코올(특)+자외선(특)+지르코니움(특)+진동(특)+크실렌(특)+톨루엔(특)', 12);
insert into examinations (worker_id, exam_date, exam_form, exam_kind, exam_category, factors_raw, cycle_months) values ((select id from workers where name='반넷' limit 1), '2024-09-09', '내원검진', '특수검진', '일반+특수', '우울증(일)+일반검진(일)+2-부톡시에탄올(특)+구리(특)+기타광물성분진(특)+망간(특)+메틸에틸케톤(특)+메틸이소부틸케톤(특)+미네랄오일미스트(특)+산화철(특)+소음(특)+아세톤(특)+알루미늄(특)+용접흄(특)+유리섬유분진(특)+이소프로필알코올(특)+자외선(특)+지르코니움(특)+진동(특)+크실렌(특)+톨루엔(특)', 12);
insert into examinations (worker_id, exam_date, exam_form, exam_kind, exam_category, factors_raw, cycle_months) values ((select id from workers where name='쏨피아' limit 1), '2024-09-09', '내원검진', '특수검진', '일반+특수', '일반검진(일)+2-부톡시에탄올(특)+구리(특)+기타광물성분진(특)+망간(특)+메틸에틸케톤(특)+메틸이소부틸케톤(특)+미네랄오일미스트(특)+산화철(특)+소음(특)+아세톤(특)+알루미늄(특)+용접흄(특)+유리섬유분진(특)+이소프로필알코올(특)+자외선(특)+지르코니움(특)+진동(특)+크실렌(특)+톨루엔(특)', 12);
insert into examinations (worker_id, exam_date, exam_form, exam_kind, exam_category, factors_raw, cycle_months) values ((select id from workers where name='진피에룬' limit 1), '2024-09-09', '내원검진', '배치전검진', '배치전', '2-부톡시에탄올(배)+구리(배)+기타광물성분진(배)+망간(배)+메틸에틸케톤(배)+메틸이소부틸케톤(배)+미네랄오일미스트(배)+산화철(배)+소음(배치전)(배)+아세톤(배)+알루미늄(배)+용접흄(배)+유리섬유분진(배)+이소프로필알코올(배)+자외선(배)+지르코니움(배)+진동(배)+크실렌(채용)(배)+톨루엔(채용)(배)', 12);
insert into examinations (worker_id, exam_date, exam_form, exam_kind, exam_category, factors_raw, cycle_months) values ((select id from workers where name='칭마이' limit 1), '2024-09-09', '내원검진', '특수검진', '일반+특수', '우울증(일)+일반검진(일)+2-부톡시에탄올(특)+구리(특)+기타광물성분진(특)+망간(특)+메틸에틸케톤(특)+메틸이소부틸케톤(특)+미네랄오일미스트(특)+산화철(특)+소음(특)+아세톤(특)+알루미늄(특)+용접흄(특)+유리섬유분진(특)+이소프로필알코올(특)+자외선(특)+지르코니움(특)+진동(특)+크실렌(특)+톨루엔(특)', 12);
insert into examinations (worker_id, exam_date, exam_form, exam_kind, exam_category, factors_raw, cycle_months) values ((select id from workers where name='이재환' limit 1), '2024-09-10', '내원검진', '특수검진', '일반+특수', '일반검진(일)+2-부톡시에탄올(특)+구리(특)+기타광물성분진(특)+망간(특)+메틸에틸케톤(특)+메틸이소부틸케톤(특)+미네랄오일미스트(특)+산화철(특)+소음(특)+아세톤(특)+알루미늄(특)+용접흄(특)+유리섬유분진(특)+이소프로필알코올(특)+자외선(특)+지르코니움(특)+진동(특)+크실렌(특)+톨루엔(특)', 12);
insert into examinations (worker_id, exam_date, exam_form, exam_kind, exam_category, factors_raw, cycle_months) values ((select id from workers where name='삼바트' limit 1), '2024-10-14', '내원검진', '배치전검진', '배치전', '2-부톡시에탄올(배)+구리(배)+기타광물성분진(배)+망간(배)+메틸에틸케톤(배)+메틸이소부틸케톤(배)+미네랄오일미스트(배)+산화철(배)+소음(배치전)(배)+아세톤(배)+알루미늄(배)+용접흄(배)+유리섬유분진(배)+이소프로필알코올(배)+자외선(배)+지르코니움(배)+진동(배)+크실렌(배)+톨루엔(배)', 12);
insert into examinations (worker_id, exam_date, exam_form, exam_kind, exam_category, factors_raw, cycle_months) values ((select id from workers where name='양롱' limit 1), '2024-10-14', '내원검진', '배치전검진', '배치전', '2-부톡시에탄올(배)+구리(배)+기타광물성분진(배)+망간(배)+메틸에틸케톤(배)+메틸이소부틸케톤(배)+미네랄오일미스트(배)+산화철(배)+소음(배치전)(배)+아세톤(배)+알루미늄(배)+용접흄(배)+유리섬유분진(배)+이소프로필알코올(배)+자외선(배)+지르코니움(배)+진동(배)+크실렌(배)+톨루엔(배)', 12);
insert into examinations (worker_id, exam_date, exam_form, exam_kind, exam_category, factors_raw, cycle_months) values ((select id from workers where name='우롬' limit 1), '2024-10-14', '내원검진', '배치전검진', '배치전', '2-부톡시에탄올(배)+구리(배)+기타광물성분진(배)+망간(배)+메틸에틸케톤(배)+메틸이소부틸케톤(배)+미네랄오일미스트(배)+산화철(배)+소음(배치전)(배)+아세톤(배)+알루미늄(배)+용접흄(배)+유리섬유분진(배)+이소프로필알코올(배)+자외선(배)+지르코니움(배)+진동(배)+크실렌(배)+톨루엔(배)', 12);
insert into examinations (worker_id, exam_date, exam_form, exam_kind, exam_category, factors_raw, cycle_months) values ((select id from workers where name='김도원' limit 1), '2024-10-21', '내원검진', '특수검진', '일반+특수', '이상지질혈증(일)+일반검진(일)+2-부톡시에탄올(특)+구리(특)+기타광물성분진(특)+망간(특)+메틸에틸케톤(특)+메틸이소부틸케톤(특)+미네랄오일미스트(특)+산화철(특)+소음(특)+아세톤(특)+알루미늄(특)+용접흄(특)+유리섬유분진(특)+이소프로필알코올(특)+자외선(특)+지르코니움(특)+진동(특)+크실렌(특)+톨루엔(특)', 12);
insert into examinations (worker_id, exam_date, exam_form, exam_kind, exam_category, factors_raw, cycle_months) values ((select id from workers where name='이우봉' limit 1), '2024-10-21', '내원검진', '특수검진', '일반+특수', '우울증(일)+이상지질혈증(일)+일반검진(일)+2-부톡시에탄올(특)+구리(특)+기타광물성분진(특)+망간(특)+메틸에틸케톤(특)+메틸이소부틸케톤(특)+미네랄오일미스트(특)+산화철(특)+소음(특)+아세톤(특)+알루미늄(특)+용접흄(특)+유리섬유분진(특)+이소프로필알코올(특)+자외선(특)+지르코니움(특)+진동(특)+크실렌(특)+톨루엔(특)', 12);
insert into examinations (worker_id, exam_date, exam_form, exam_kind, exam_category, factors_raw, cycle_months) values ((select id from workers where name='이초희' limit 1), '2024-12-06', '내원검진', '일반검진', '일반', '일반검진(일)', NULL);
insert into examinations (worker_id, exam_date, exam_form, exam_kind, exam_category, factors_raw, cycle_months) values ((select id from workers where name='신선도' limit 1), '2024-12-20', '내원검진', '특수검진', '일반+특수', '일반검진(일)+2-부톡시에탄올(특)+구리(특)+기타광물성분진(특)+망간(특)+메틸에틸케톤(특)+메틸이소부틸케톤(특)+미네랄오일미스트(특)+산화철(특)+소음(특)+아세톤(특)+알루미늄(특)+용접흄(특)+유리섬유분진(특)+이소프로필알코올(특)+자외선(특)+지르코니움(특)+진동(특)+크실렌(특)+톨루엔(특)', 12);
insert into examinations (worker_id, exam_date, exam_form, exam_kind, exam_category, factors_raw, cycle_months) values ((select id from workers where name='밴래트한' limit 1), '2024-12-24', '내원검진', '특수검진', '일반+특수', '일반검진(일)+2-부톡시에탄올(특)+구리(특)+기타광물성분진(특)+망간(특)+메틸에틸케톤(특)+메틸이소부틸케톤(특)+미네랄오일미스트(특)+산화철(특)+소음(특)+아세톤(특)+알루미늄(특)+용접흄(특)+유리섬유분진(특)+이소프로필알코올(특)+자외선(특)+지르코니움(특)+진동(특)+크실렌(특)+톨루엔(특)', 12);
insert into examinations (worker_id, exam_date, exam_form, exam_kind, exam_category, factors_raw, cycle_months) values ((select id from workers where name='사렛' limit 1), '2024-12-24', '내원검진', '특수검진', '일반+특수', '우울증(일)+일반검진(일)+2-부톡시에탄올(특)+구리(특)+기타광물성분진(특)+망간(특)+메틸에틸케톤(특)+메틸이소부틸케톤(특)+미네랄오일미스트(특)+산화철(특)+소음(특)+아세톤(특)+알루미늄(특)+용접흄(특)+유리섬유분진(특)+이소프로필알코올(특)+자외선(특)+지르코니움(특)+진동(특)+크실렌(특)+톨루엔(특)', 12);
insert into examinations (worker_id, exam_date, exam_form, exam_kind, exam_category, factors_raw, cycle_months) values ((select id from workers where name='사콘' limit 1), '2024-12-24', '내원검진', '특수검진', '일반+특수', '일반검진(일)+2-부톡시에탄올(특)+구리(특)+기타광물성분진(특)+망간(특)+메틸에틸케톤(특)+메틸이소부틸케톤(특)+미네랄오일미스트(특)+산화철(특)+소음(특)+아세톤(특)+알루미늄(특)+용접흄(특)+유리섬유분진(특)+이소프로필알코올(특)+자외선(특)+지르코니움(특)+진동(특)+크실렌(특)+톨루엔(특)', 12);
insert into examinations (worker_id, exam_date, exam_form, exam_kind, exam_category, factors_raw, cycle_months) values ((select id from workers where name='퐁' limit 1), '2024-12-24', '내원검진', '일반검진', '일반', '우울증(일)+일반검진(일)', NULL);
insert into examinations (worker_id, exam_date, exam_form, exam_kind, exam_category, factors_raw, cycle_months) values ((select id from workers where name='박지우' limit 1), '2024-12-26', '내원검진', '배치전검진', '배치전', '1,2-DCE(배)+기타광물성분진(배)+노말헥산(배)+소음(배치전)(배)+아세톤(배)+야간작업(월평균4회)(야)+이소프로필알코올(배)', 12);
insert into examinations (worker_id, exam_date, exam_form, exam_kind, exam_category, factors_raw, cycle_months) values ((select id from workers where name='김흥' limit 1), '2024-12-27', '내원검진', '일반검진', '일반', '우울증(일)+이상지질혈증(일)+일반검진(일)', NULL);
insert into examinations (worker_id, exam_date, exam_form, exam_kind, exam_category, factors_raw, cycle_months) values ((select id from workers where name='홍길현' limit 1), '2024-12-27', '내원검진', '특수검진', '일반+특수', '우울증(일)+일반검진(일)+소음(특)+톨루엔(특)', 12);
insert into examinations (worker_id, exam_date, exam_form, exam_kind, exam_category, factors_raw, cycle_months) values ((select id from workers where name='김병철' limit 1), '2024-12-30', '내원검진', '특수검진', '일반+특수', '일반검진(일)+소음(특)+톨루엔(특)', 12);
insert into examinations (worker_id, exam_date, exam_form, exam_kind, exam_category, factors_raw, cycle_months) values ((select id from workers where name='능롬' limit 1), '2024-12-30', '내원검진', '일반검진', '일반', '우울증(일)+이상지질혈증(일)+일반검진(일)', NULL);
insert into examinations (worker_id, exam_date, exam_form, exam_kind, exam_category, factors_raw, cycle_months) values ((select id from workers where name='윤수현' limit 1), '2024-12-31', '내원검진', '특수검진', '일반+특수', '일반검진(일)+소음(특)+톨루엔(특)', 12);
insert into examinations (worker_id, exam_date, exam_form, exam_kind, exam_category, factors_raw, cycle_months) values ((select id from workers where name='윤훈재' limit 1), '2025-02-28', '내원검진', '야간+배치전검진', '야간+배치전', NULL, NULL);
insert into examinations (worker_id, exam_date, exam_form, exam_kind, exam_category, factors_raw, cycle_months) values ((select id from workers where name='이금호' limit 1), '2025-04-17', '내원검진', '특수검진', '일반+특수', NULL, NULL);
insert into examinations (worker_id, exam_date, exam_form, exam_kind, exam_category, factors_raw, cycle_months) values ((select id from workers where name='김대훈' limit 1), '2025-07-10', '출장검진', '특수검진', '일반+특수', NULL, NULL);
insert into examinations (worker_id, exam_date, exam_form, exam_kind, exam_category, factors_raw, cycle_months) values ((select id from workers where name='김도원' limit 1), '2025-07-10', '출장검진', '특수검진', '일반+특수', NULL, NULL);
insert into examinations (worker_id, exam_date, exam_form, exam_kind, exam_category, factors_raw, cycle_months) values ((select id from workers where name='김찬호' limit 1), '2025-07-10', '출장검진', '특수검진', '일반+특수', NULL, NULL);
insert into examinations (worker_id, exam_date, exam_form, exam_kind, exam_category, factors_raw, cycle_months) values ((select id from workers where name='김효동' limit 1), '2025-07-10', '출장검진', '특수검진', '일반+특수', NULL, NULL);
insert into examinations (worker_id, exam_date, exam_form, exam_kind, exam_category, factors_raw, cycle_months) values ((select id from workers where name='나타왓' limit 1), '2025-07-10', '출장검진', '특수검진', '일반+특수', NULL, NULL);
insert into examinations (worker_id, exam_date, exam_form, exam_kind, exam_category, factors_raw, cycle_months) values ((select id from workers where name='듄' limit 1), '2025-07-10', '출장검진', '특수검진', '일반+특수', NULL, NULL);
insert into examinations (worker_id, exam_date, exam_form, exam_kind, exam_category, factors_raw, cycle_months) values ((select id from workers where name='리스' limit 1), '2025-07-10', '출장검진', '특수검진', '일반+특수', NULL, NULL);
insert into examinations (worker_id, exam_date, exam_form, exam_kind, exam_category, factors_raw, cycle_months) values ((select id from workers where name='반넷' limit 1), '2025-07-10', '출장검진', '특수검진', '일반+특수', NULL, NULL);
insert into examinations (worker_id, exam_date, exam_form, exam_kind, exam_category, factors_raw, cycle_months) values ((select id from workers where name='밴래트한' limit 1), '2025-07-10', '출장검진', '특수검진', '일반+특수', NULL, NULL);
insert into examinations (worker_id, exam_date, exam_form, exam_kind, exam_category, factors_raw, cycle_months) values ((select id from workers where name='사디라리' limit 1), '2025-07-10', '출장검진', '특수검진', '일반+특수', NULL, NULL);
insert into examinations (worker_id, exam_date, exam_form, exam_kind, exam_category, factors_raw, cycle_months) values ((select id from workers where name='사렛' limit 1), '2025-07-10', '출장검진', '특수검진', '일반+특수', NULL, NULL);
insert into examinations (worker_id, exam_date, exam_form, exam_kind, exam_category, factors_raw, cycle_months) values ((select id from workers where name='사콘' limit 1), '2025-07-10', '출장검진', '특수검진', '일반+특수', NULL, NULL);
insert into examinations (worker_id, exam_date, exam_form, exam_kind, exam_category, factors_raw, cycle_months) values ((select id from workers where name='삼바트' limit 1), '2025-07-10', '출장검진', '특수검진', '일반+특수', NULL, NULL);
insert into examinations (worker_id, exam_date, exam_form, exam_kind, exam_category, factors_raw, cycle_months) values ((select id from workers where name='샤논' limit 1), '2025-07-10', '출장검진', '특수검진', '일반+특수', NULL, NULL);
insert into examinations (worker_id, exam_date, exam_form, exam_kind, exam_category, factors_raw, cycle_months) values ((select id from workers where name='샤흐조드' limit 1), '2025-07-10', '출장검진', '특수검진', '일반+특수', NULL, NULL);
insert into examinations (worker_id, exam_date, exam_form, exam_kind, exam_category, factors_raw, cycle_months) values ((select id from workers where name='소파오' limit 1), '2025-07-10', '출장검진', '특수검진', '일반+특수', NULL, NULL);
insert into examinations (worker_id, exam_date, exam_form, exam_kind, exam_category, factors_raw, cycle_months) values ((select id from workers where name='시라제딘' limit 1), '2025-07-10', '출장검진', '특수검진', '일반+특수', NULL, NULL);
insert into examinations (worker_id, exam_date, exam_form, exam_kind, exam_category, factors_raw, cycle_months) values ((select id from workers where name='신선도' limit 1), '2025-07-10', '출장검진', '특수검진', '일반+특수', NULL, NULL);
insert into examinations (worker_id, exam_date, exam_form, exam_kind, exam_category, factors_raw, cycle_months) values ((select id from workers where name='쏨피아' limit 1), '2025-07-10', '출장검진', '특수검진', '일반+특수', NULL, NULL);
insert into examinations (worker_id, exam_date, exam_form, exam_kind, exam_category, factors_raw, cycle_months) values ((select id from workers where name='아지즈벡' limit 1), '2025-07-10', '출장검진', '특수검진', '일반+특수', NULL, NULL);
insert into examinations (worker_id, exam_date, exam_form, exam_kind, exam_category, factors_raw, cycle_months) values ((select id from workers where name='우롬' limit 1), '2025-07-10', '출장검진', '특수검진', '일반+특수', NULL, NULL);
insert into examinations (worker_id, exam_date, exam_form, exam_kind, exam_category, factors_raw, cycle_months) values ((select id from workers where name='이우봉' limit 1), '2025-07-10', '출장검진', '특수검진', '일반+특수', NULL, NULL);
insert into examinations (worker_id, exam_date, exam_form, exam_kind, exam_category, factors_raw, cycle_months) values ((select id from workers where name='이준병' limit 1), '2025-07-10', '출장검진', '특수검진', '일반+특수', NULL, NULL);
insert into examinations (worker_id, exam_date, exam_form, exam_kind, exam_category, factors_raw, cycle_months) values ((select id from workers where name='임채승' limit 1), '2025-07-10', '출장검진', '특수검진', '일반+특수', NULL, NULL);
insert into examinations (worker_id, exam_date, exam_form, exam_kind, exam_category, factors_raw, cycle_months) values ((select id from workers where name='차도환' limit 1), '2025-07-10', '출장검진', '특수검진', '일반+특수', NULL, NULL);
insert into examinations (worker_id, exam_date, exam_form, exam_kind, exam_category, factors_raw, cycle_months) values ((select id from workers where name='칭마이' limit 1), '2025-07-10', '출장검진', '특수검진', '일반+특수', NULL, NULL);
insert into examinations (worker_id, exam_date, exam_form, exam_kind, exam_category, factors_raw, cycle_months) values ((select id from workers where name='티찬타' limit 1), '2025-07-10', '출장검진', '특수검진', '일반+특수', NULL, NULL);
insert into examinations (worker_id, exam_date, exam_form, exam_kind, exam_category, factors_raw, cycle_months) values ((select id from workers where name='포핀' limit 1), '2025-07-10', '출장검진', '특수검진', '일반+특수', NULL, NULL);
insert into examinations (worker_id, exam_date, exam_form, exam_kind, exam_category, factors_raw, cycle_months) values ((select id from workers where name='웨이웃타나폰' limit 1), '2025-07-10', '출장검진', '특수검진', '일반+배치전', NULL, NULL);
insert into examinations (worker_id, exam_date, exam_form, exam_kind, exam_category, factors_raw, cycle_months) values ((select id from workers where name='김진우' limit 1), '2025-07-10', '출장검진', '일반검진', '일반', NULL, NULL);
insert into examinations (worker_id, exam_date, exam_form, exam_kind, exam_category, factors_raw, cycle_months) values ((select id from workers where name='김흥' limit 1), '2025-07-10', '출장검진', '일반검진', '일반', NULL, NULL);
insert into examinations (worker_id, exam_date, exam_form, exam_kind, exam_category, factors_raw, cycle_months) values ((select id from workers where name='능롬' limit 1), '2025-07-10', '출장검진', '일반검진', '일반', NULL, NULL);
insert into examinations (worker_id, exam_date, exam_form, exam_kind, exam_category, factors_raw, cycle_months) values ((select id from workers where name='다어쥐용옥' limit 1), '2025-07-10', '출장검진', '일반검진', '일반', NULL, NULL);
insert into examinations (worker_id, exam_date, exam_form, exam_kind, exam_category, factors_raw, cycle_months) values ((select id from workers where name='레보라' limit 1), '2025-07-10', '출장검진', '일반검진', '일반', NULL, NULL);
insert into examinations (worker_id, exam_date, exam_form, exam_kind, exam_category, factors_raw, cycle_months) values ((select id from workers where name='렛사라스' limit 1), '2025-07-10', '출장검진', '일반검진', '일반', NULL, NULL);
insert into examinations (worker_id, exam_date, exam_form, exam_kind, exam_category, factors_raw, cycle_months) values ((select id from workers where name='백민숙' limit 1), '2025-07-10', '출장검진', '일반검진', '일반', NULL, NULL);
insert into examinations (worker_id, exam_date, exam_form, exam_kind, exam_category, factors_raw, cycle_months) values ((select id from workers where name='산티' limit 1), '2025-07-10', '출장검진', '일반검진', '일반', NULL, NULL);
insert into examinations (worker_id, exam_date, exam_form, exam_kind, exam_category, factors_raw, cycle_months) values ((select id from workers where name='심승' limit 1), '2025-07-10', '출장검진', '일반검진', '일반', NULL, NULL);
insert into examinations (worker_id, exam_date, exam_form, exam_kind, exam_category, factors_raw, cycle_months) values ((select id from workers where name='원충효' limit 1), '2025-07-10', '출장검진', '일반검진', '일반', NULL, NULL);
insert into examinations (worker_id, exam_date, exam_form, exam_kind, exam_category, factors_raw, cycle_months) values ((select id from workers where name='유기모' limit 1), '2025-07-10', '출장검진', '일반검진', '일반', NULL, NULL);
insert into examinations (worker_id, exam_date, exam_form, exam_kind, exam_category, factors_raw, cycle_months) values ((select id from workers where name='윤훈재' limit 1), '2025-07-10', '출장검진', '일반검진', '일반', NULL, NULL);
insert into examinations (worker_id, exam_date, exam_form, exam_kind, exam_category, factors_raw, cycle_months) values ((select id from workers where name='이승정' limit 1), '2025-07-10', '출장검진', '일반검진', '일반', NULL, NULL);
insert into examinations (worker_id, exam_date, exam_form, exam_kind, exam_category, factors_raw, cycle_months) values ((select id from workers where name='이재환' limit 1), '2025-07-10', '출장검진', '일반검진', '일반', NULL, NULL);
insert into examinations (worker_id, exam_date, exam_form, exam_kind, exam_category, factors_raw, cycle_months) values ((select id from workers where name='다나톤' limit 1), '2025-09-24', '내원검진', '특수검진', '일반+특수', NULL, NULL);
insert into examinations (worker_id, exam_date, exam_form, exam_kind, exam_category, factors_raw, cycle_months) values ((select id from workers where name='진피에룬' limit 1), '2025-09-24', '내원검진', '특수검진', '일반+특수', NULL, NULL);
insert into examinations (worker_id, exam_date, exam_form, exam_kind, exam_category, factors_raw, cycle_months) values ((select id from workers where name='퐁' limit 1), '2025-09-24', '내원검진', '일반검진', '일반', NULL, NULL);
insert into examinations (worker_id, exam_date, exam_form, exam_kind, exam_category, factors_raw, cycle_months) values ((select id from workers where name='심현섭' limit 1), '2025-09-30', '내원검진', '특수검진', '일반+특수', NULL, NULL);
insert into examinations (worker_id, exam_date, exam_form, exam_kind, exam_category, factors_raw, cycle_months) values ((select id from workers where name='김병철' limit 1), '2025-10-24', '내원검진', '특수검진', '일반+특수', NULL, NULL);
insert into examinations (worker_id, exam_date, exam_form, exam_kind, exam_category, factors_raw, cycle_months) values ((select id from workers where name='윤수현' limit 1), '2025-10-24', '내원검진', '특수검진', '일반+특수', NULL, NULL);
insert into examinations (worker_id, exam_date, exam_form, exam_kind, exam_category, factors_raw, cycle_months) values ((select id from workers where name='양성경' limit 1), '2025-10-27', '내원검진', '특수검진', '특수', NULL, NULL);
insert into examinations (worker_id, exam_date, exam_form, exam_kind, exam_category, factors_raw, cycle_months) values ((select id from workers where name='신승호' limit 1), '2025-10-27', '내원검진', '특수검진', '일반+특수', NULL, NULL);
insert into examinations (worker_id, exam_date, exam_form, exam_kind, exam_category, factors_raw, cycle_months) values ((select id from workers where name='마카라' limit 1), '2025-10-31', '내원검진', '일반검진', '일반', NULL, NULL);

-- 근로자 자동 주기 업데이트 (locked가 false인 것만)

update workers w
set cycle_months = coalesce((
  select e.cycle_months from examinations e
  where e.worker_id = w.id
    and e.cycle_months is not null
  order by e.exam_date desc
  limit 1
), 12)
where w.cycle_locked = false;
