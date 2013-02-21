			// DB 초기설정
			function initDB(tx) {
				// QNA 테이블 생성
        		tx.executeSql("CREATE TABLE IF NOT EXISTS QNA(COUNT INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, WRITER TEXT NOT NULL, PASSWD TEXT NOT NULL, " +
					"PHONE TEXT NOT NULL, EMAIL TEXT NOT NULL, CATEGORY TEXT NOT NULL, SUBJECT TEXT NOT NULL, CONTENT NOT NULL, " +
					"WDATE TEXT NOT NULL, ANSWER INTEGER DEFAULT 0 NOT NULL, HIT INTEGER DEFAULT 0 NOT NULL)");
				// COMMENT 테이블 생성
	        	tx.executeSql("CREATE TABLE IF NOT EXISTS COMMENT(COUNT INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, QNACNT INTEGER NOT NULL," +
	        		"WRITER TEXT NOT NULL, PASSWD TEXT NOT NULL, CONTENT NOT NULL, WDATE TEXT NOT NULL)");
			}
			// DB 연결중 문제가 생겼을 때
			function errorDB(err) {
	        	console.log("Error processing SQL: "+err.code);
	    	}

 			
			////////////////////////////////////////////////////////////
			// 여기부터 일반 함수
			////////////////////////////////////////////////////////////
			// [새글쓰기]로 이로
			function btnWritePage(){
				$("#popUpContent").empty();
				$('.northContent').empty();
				$("#newWrite").show();
			}

			// 새글쓰기 폼에서 [작성완료]버튼 클릭시
 			function btnSubmitWrite(){
				var form = document.formWrite;
				var writer = form.writer.value;
 				var passwd = form.passwd.value;
				var category = form.category.value;
				var phone = form.phone1.value + form.phone2.value + form.phone3.value;
				var email = form.email.value;
				var subject = form.subject.value;
				var content = form.content.value;
				form.writer.value = "";
				form.passwd.value = "";
				form.category.value = "일반문의";
				form.phone1.value = "";
				form.phone2.value = "";
				form.phone3.value = "";
				form.email.value = "";
				form.subject.value = "";
				form.content.value = "";
				insertData(writer, passwd, phone, email, category, subject, content);
				// 글쓰기창 제거
				$("#newWrite").hide();
				// 리스트 새로고침
				$(".list").remove();
				selectList();
 			}
			
			// 페이지 클릭에 대한 이벤트 처리
 			function pageListener(){
 	 			$(".pageNum").click(function(e) {
 	 				// 클릭한 현재 페이지의 페이지번호만 추출
 	 				var str = $(this).text();
					var curPage = str.replace(/[^0-9]/g, "");
					var perPage = 5;
					// 시작하는 글번호 판단
					var start = (curPage-1) * perPage;
					// 페이지에 효과주기. 현재 페이지만 굵게 표기
					$(this).parent().children().css({"color": "black", "font-weight": "normal"});
					$(this).css({"color": "red", "font-weight": "bold"});
					// 리스트와 본문이 있다면 제거
	 				$('#popUpContent').empty();
					$('.northContent').empty();
					$('.list').remove();
					// 해당 페이지의 테이블을 가져오는 쿼리
					qnaSelectListDB(start, perPage);
	 			});
 			}
			
			// [검색]버튼 클릭시
			function btnSearch(){
				var search = document.all.search.value;
				var type = document.all.selectSearch.value;
				if(type == "이름"){
					type = "WRITER";
				}else if(type == "제목"){
					type = "SUBJECT";
				}else if(type == "본문"){
					type = "CONTENT";
				}
 				$('#popUpContent').empty();
				$('.list').remove();
				$('.pageTable').empty();
				selectSearchDB(type, search);
			}
			
 			// 리스트 클릭에 대한 이벤트 처리
 			function contentListener(){
 	 			$(".list").click(function(e) {
 	 				count = parseInt($(this).text());
 	 				//$("#content").remove();
 	 				var left = 650;
 	 				var top = 100;
 	 				// 선택한 글의 조회수를 증가
 	 				qnaHitUpdateDB(count);
 	 				// 선택한 글의 본문을 출력
 	 				qnaSelectContentDB(count);

	 				$('#newWrite').hide();
	 				$('#popUpContent').show();

	 			});
 			}
 			

	 		
 			// 본문의 [수정], [삭제]시 비밀번호 체크
	 		function btnContentCheck(option){
	 			var passwd = prompt("비밀번호를 입력하세요.");
	 			// 옵션에 따라 다른 함수를 호출
 	 			if(option == 'delete'){
 	 				qnaDeleteDB(count, passwd);
	 			}else if(option == 'modify'){
	 				qnaModifyDB(count, passwd);
	 			}
	 		}
	 		
 			// 본문의 [수정완료] 버튼 클릭시 - 본문 UPDATE
	 		function btnModifySubmit(){
 	 			var writer = $(".contentWriter").val();
	 			var passwd = $(".contentPasswd").val();
	 			var phone = $(".contentPhone1").val() + $(".contentPhone2").val() + $(".contentPhone3").val();
	 			var email = $(".contentEmail").val();
	 			var category = $(".contentCategory").val();
	 			var subject = $(".contentSubject").val();
	 			var content = $(".contentContent").val();
	 			// 업데이트 쿼리 실행
	 			qnaUpdateContentDB(count, writer, passwd, phone, email, category, subject, content);
	 			alert('본문 수정이 완료되었습니다.');
	 			qnaSelectContentDB(count);

	 		}
	 		
	 		// 리플의 content 선택시 내용을 비움
	 		function replyListener(){
	 			$(".commentContent").click(function(e) {
	 				$(this).text("");
	 			});
	 		}
 			
 			// 리플의 [작성] 버튼 클릭시
	 		function btnWriteComment(count){
	 			var writer = $(".commentWriter").val();
		    	var passwd = $(".commentPasswd").val();
		    	var content = $(".commentContent").val();
		    	// 인서트 쿼리 실행
	 			commentInsertDB(count, writer, passwd, content);
	 			qnaAnsUpdateDB("+",count);
		    	// 본문 새로고침
 				qnaSelectContentDB(count);
	 		}
 			
			// 리플의 [수정], [삭제]에 대한 이벤트 처리
			function replyCheckListener(){
	 	 		$(".commentModify").click(function(e) {
	 	 			$(this).attr("disabled", "true");
	 	 			// 게시글의 카운트
	 	 			var qnacnt = count;
	 	 			// 리플의 카운트
	 	 			var cnt = $(this).next().next().next().val();
	 	 			var passwd = prompt("비밀번호를 입력하세요.");
	 	 			// 클릭지점의 위치값정보
	 	 			var curTd = $(this).parent();
	 	 			// 리플수정에 대한 쿼리 및 로직
	 	 			commentModifyDB(qnacnt, cnt, passwd, curTd);
		 		});
		 	 	$(".commentDelete").click(function(e) {
		 	 		$(this).attr("disabled", "true");
	 	 			var qnacnt = count;
	 	 			var cnt = $(this).next().val();
	 		 		var passwd = prompt("비밀번호를 입력하세요.");
	 		 		// 리플 삭제에 대한 쿼리 및 로직
	 	 			commentDeleteDB(qnacnt, cnt, passwd);
		 		});
			 }
			 
			// 리플의 수정모드에서 [수정완료], [수정취소]에 대한 이벤트 처리
			function replyModifyListener(){
		 	 	$(".commentModifyCancel").click(function(e) {
		 	 		$(this).attr("disabled", "true");
		 	 		var qnacnt = count;
		 	 		// 취소시 안내메시지 출력 후 동일 게시글 새로고침
		 			alert('리플 수정이 취소되었습니다.');
		 			qnaSelectContentDB(qnacnt);
		 		});
		 	 	$(".commentModifyOK").click(function(e) {
		 	 		$(this).attr("disabled", "true");
		 	 		var qnacnt = count;
		 	 		var cnt = $(this).next().val();
					var content = $(this).parent().parent().children('td.commentContentForm').children('textarea').val();
					// DB를 수정된 내용으로 업데이트
		 			commentUpdateDB(qnacnt, cnt, content);
					// 안내 메시지 출력 후 게시글 새로고침
		 			alert('리플 수정이 완료되었습니다.');
		 			qnaSelectContentDB(qnacnt);
		 		});
			 }