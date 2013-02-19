function insertData(writer, passwd, phone, email, category, subject, content){
	db.transaction(function(tx){
		tx.executeSql("INSERT INTO QNA(COUNT, WRITER, PASSWD, PHONE, EMAIL, CATEGORY, SUBJECT, CONTENT, WDATE) VALUES(NULL, ?, ?, ?, ?, ?, ?, ?, datetime('now', 'localtime'))", [writer, passwd, phone, email, category, subject, content]);
	});
}


			////////////////////////////////////////////////////////////
			// 게시판 리스트 SELECT
			////////////////////////////////////////////////////////////
			// 게시판 리스트 출력. 페이지판별
 			function selectList(){
				db.transaction(function(tx){
					tx.executeSql("SELECT COUNT(*) AS CNT FROM QNA", [],
						function(tx, results){
							var row = results.rows.item(0);
							var cnt = row['CNT'];
							var perPage = 5; // 페이지당 글수
							var totPage; // 총 페이지수
							var start = 0;
							// 게시믈의 페이지 갯수를 결정
						    if((cnt % perPage) == 0){
						    	totPage = parseInt((cnt / perPage));
						    }else{
						    	totPage = parseInt((cnt / perPage + 1));
						    }
						    // 폼들을 초기화
						    $(".northContent").empty();
						    $(".list").remove();
						    $(".pageNum").remove();
							// 페이지정보를 게시판 아래에 출력
						    var fullTag = "";
							for(var i = 1 ; i <= totPage ; i++){
								fullTag += "<TD class='pageNum' style='cursor:pointer'>["+i+"]</TD>";	
							}

							$(".pageTable").append(fullTag);
							$(".pageTable > td").first().css({"color": "red", "font-weight": "bold"});
							// 초기  첫페이지 리스트 출력
							qnaSelectListDB(start, perPage);
							// 페이지 클릭에 대한 이벤트 설정
							pageListener();
				    	}, errorDB
				    );
				}, errorDB);
			}
 			
		    // 페이지의 게시물을 가져와 테이블에 출력
 			function qnaSelectListDB(start, perPage){
				db.transaction(function(tx){
					// 셀렉 쿼리
					tx.executeSql("SELECT COUNT, WRITER, CATEGORY, SUBJECT, WDATE, ANSWER, HIT FROM QNA ORDER BY WDATE DESC LIMIT ? OFFSET ?", [perPage, start],
						function(tx, results){
						var length = results.rows.length;
						var fullTag = "";
						// 테이블에 해당 페이지의 내용을 출력
						for(var i = 0; i < length ; i++){
							var row = results.rows.item(i);
							var count = row['COUNT'];
							fullTag +=
								"<TR align='center' class='list' style='cursor:pointer'>" +
								"<TD>" + row['COUNT'] + "</TD>" +
								"<TD>" + row['CATEGORY'] + "</TD><TD>" + row['SUBJECT'] + "</TD><TD>" + row['WRITER'] + "</TD>" +
								"<TD>" + row['ANSWER'] + "</TD><TD>" + row['WDATE'] + "</TD><TD>" + row['HIT'] + "</TD></TR>";
						}
						$('#board').append(fullTag);
						// 게시글 클릭에 대한 이벤트 설정
						contentListener();
				    	}, errorDB
				    );
				}, errorDB);
			}
 			
			////////////////////////////////////////////////////////////
			// 게시판 검색 SELECT
			////////////////////////////////////////////////////////////
		    // 검색결과 출력
 			function selectSearchDB(type, search){
				db.transaction(function(tx){
					// 셀렉 쿼리
					tx.executeSql("SELECT COUNT, WRITER, CATEGORY, SUBJECT, WDATE, ANSWER, HIT FROM QNA WHERE " + type + " LIKE '%"+search+"%' ORDER BY WDATE DESC", [],
						function(tx, results){
						var length = results.rows.length;
						var fullTag = "";
						// 테이블에 해당 페이지의 내용을 출력
 						for(var i = 0; i < length ; i++){
							var row = results.rows.item(i);
							var count = row['COUNT'];
							fullTag +=
								"<TR align='center' class='list'>" +
								"<TD>" + row['COUNT'] + "</TD>" +
								"<TD>" + row['CATEGORY'] + "</TD><TD>" + row['SUBJECT'] + "</TD><TD>" + row['WRITER'] + "</TD>" +
								"<TD>" + row['ANSWER'] + "</TD><TD>" + row['WDATE'] + "</TD><TD>" + row['HIT'] + "</TD></TR>";
						}
						$('#board').append(fullTag);
						// 게시글 클릭에 대한 이벤트 설정
						contentListener();
				    	}, errorDB
				    );
				}, errorDB);
			}
 			
			////////////////////////////////////////////////////////////
			// 게시판 본문 SELECT
			////////////////////////////////////////////////////////////
			// 게시판 본문 쿼리실행
			function qnaSelectContentDB(count){
				db.transaction(function(tx){
					tx.executeSql("SELECT * FROM QNA WHERE COUNT = ?", [count], qnaSelectContentOK, errorDB);
				}, errorDB);
			}
			
			// 게시판 본문 출력
			function qnaSelectContentOK(tx, results) {
				// 기존 정보가 있다면 삭제
	 			$("#content").remove();
	 			$("#modify").remove();
	 			// 리절트
				var length = results.rows.length;
				var row = results.rows.item(0);
				var count = row['COUNT'];
				// 게시판 본문 구성
				$(".northContent").empty();
				var fullTag =
					"<INPUT type='button' value='수정하기' id='modify' onClick=JavaScript:btnContentCheck('modify');this.disabled=true>" +
					"<INPUT type='button' value='삭제하기' id='delete' onClick=JavaScript:btnContentCheck('delete');this.disabled=true>";
				$(".northContent").append(fullTag);
				fullTag = 
					"<DIV id='content'>" +
					"<INPUT type='hidden' name='test3' value="+count+">" +
					"<TABLE border='1' style=width:100%>" +
					"<TR align='center'>" +
					"<TH>번호</TH>" +
					"<TH>카테고리</TH>" +
					"<TH>제목</TH>" +
					"<TH>이름</TH>" +
					"<TH>답변개수</TH>" +
					"<TH>작성시간</TH>" +
					"<TH>조회수</TH>" +
					"</TR>" +
					"<TR align='center'>" +
					"<TD>" + row['COUNT'] + "</TD>" +
					"<TD>" + row['CATEGORY'] + "</TD><TD>" + row['SUBJECT'] + "</TD><TD>" + row['WRITER'] + "</TD>" +
					"<TD>" + row['ANSWER'] + "</TD><TD>" + row['WDATE'] + "</TD><TD>" + row['HIT'] + "</TD></TR>" +
					"<TR align='center'><TD colspan='7'><TABLE border='1' id='comment' style=width:100%>" +
					"<TR align='center'><TD>핸드폰</TD><TD>" + row['PHONE'] + "</TD><TD>이메일</TD><TD>" + row['EMAIL'] + "</TD></TR>" +
					"<TR align='center'><TD colspan='4'>제 목</TD></TR>" +
					"<TR align='center'><TD colspan='4'>" + row['SUBJECT'] + "</TD></TR>" +
					"<TR align='center'><TD colspan='4'>내 용</TD></TR>" +
					"<TR align='center'><TD colspan='4'>" + row['CONTENT'] + "</TD></TR>" +
					"<TR align='center'><TD>이름<BR><INPUT type='text' class='commentWriter' size='15' maxlength='15'>" +
					"<BR>비밀번호<BR><INPUT type='password' class='commentPasswd' size='10' maxlength='10'></TD>" +
					"<TD colspan='2'><TEXTAREA rows='5' cols='40' class='commentContent'>리플을 작성하세요.</TEXTAREA></TD>" +
					"<TD><INPUT type='button' value='작성' onClick='JavaScript:btnWriteComment("+row['COUNT']+");this.disabled=true'></TD></TR>"+
					"</TABLE></TD></TR></TABLE></DIV>";
				// 실제 태그를 숨겨있던 div에 적용
				$("#popUpContent").append(fullTag);
				// 리플작성을 위해 textArea 클릭시 내용을 비워줌
 	 			$(".commentContent").click(function(e) {
 	 				$(this).text("");
	 			});
	 			
				// 게시글에 맞는 리플 쿼리 호출
				commentSelectDB(count);
		    }
			
			////////////////////////////////////////////////////////////
			// 게시글 삭제 SELECT & DELETE
			////////////////////////////////////////////////////////////
			// 게시글 삭제에 대한 쿼리 및 로직
			function qnaDeleteDB(count, passwd){
				db.transaction(function(tx){
					tx.executeSql("SELECT PASSWD FROM QNA WHERE COUNT = ? AND PASSWD = ?", [count, passwd],
						function(tx, results){
							var length = results.rows.length;
							// COUNT, PASSWD 일치
							if(length == 1){
								// 삭제는 정말 삭제할지 다시 물음
								if(confirm('정말 삭제하시겠습니까?')){
									// 게시글 및 게시글에 해당하는 리플 삭제
		 	 						qnaDeleteContent(count, passwd);
		 	 						commentDeleteContent(count);
		 	 						// 관련 폼을 삭제하고 list를 재출력
		 	 	 					$('#popUpContent').empty();
		 	 	 					$(".northContent").empty();
		 	 	 					$(".list").remove();
		 	 	 					selectList();
								}else{
									alert('삭제가 취소되었습니다.');
									qnaSelectContentDB(count);
								}
							// COUNT, PASSWD 불일치
							}else if(length == 0){
								// 안내 메시지 출력
								alert('비밀번호가 맞지 않습니다.');
								qnaSelectContentDB(count);
							}
				    	}, errorDB
				    );
				}, errorDB);
			}
			
			// 본문글을 삭제했을때 발생하는 쿼리
 			function qnaDeleteContent(count, passwd){
 				db.transaction(function(tx){
 					tx.executeSql("DELETE FROM QNA WHERE COUNT = ? AND PASSWD = ?", [count, passwd]);
 				}, errorDB);
 			}
			
			// 본문글을 삭제했을때 관련 리플도 모두 삭제하는 쿼리
 			function commentDeleteContent(count){
 				db.transaction(function(tx){
 					tx.executeSql("DELETE FROM COMMENT WHERE QNACNT = ?", [count]);//, [writer, passwd, phone, email, category, subject, content]);
 				}, errorDB);
 			}
 			
			////////////////////////////////////////////////////////////
			// 게시글 수정 SELECT & UPDATE
			////////////////////////////////////////////////////////////
			// 게시글 수정에 대한 쿼리 및 로직
			function qnaModifyDB(count, passwd){
				db.transaction(function(tx){
					tx.executeSql("SELECT PASSWD FROM QNA WHERE COUNT = ? AND PASSWD = ?", [count, passwd],
						function(tx, results){
							var length = results.rows.length;
							// COUNT, PASSWD 일치
							if(length == 1){
								// 수정을 위해 본문을 다시 갖고오는 함수
								qnaModifyContentDB(count, passwd);
							// COUNT, PASSWD 불일치
							}else if(length == 0){
								// 안내 메시지 출력
								alert('비밀번호가 맞지 않습니다.');	
								qnaSelectContentDB(count);
							}
				    	}, errorDB
				    );
				}, errorDB);
			}

			// 게시글 본문을 가져오는 쿼리 실행
			function qnaModifyContentDB(count, passwd){
				db.transaction(function(tx){
					tx.executeSql("SELECT * FROM QNA WHERE COUNT = ? AND PASSWD = ?", [count, passwd], qnaModifyContentOK, errorDB);
				}, errorDB);
			}
			
			// 게시글 본문을 가져와 수정할 수 있는 폼을 만들고 해당 값을 적절히 배치
			function qnaModifyContentOK(tx, results) {
				// 새로운 폼 작성을 위해 이전 폼들을 삭제
				$("#content").remove();
				$("#modify").remove();
				// 리절트
				var length = results.rows.length;
				var row = results.rows.item(0);
				var count = row['COUNT'];
				// 핸드폰 예외처리
				var phone1 = null;
				var phone2 = null;
				var phone3 = null;
				if(row['PHONE'].length == 11){
					phone1 = row['PHONE'].substring(0, 3);
					phone2 = row['PHONE'].substring(3, 7);
					phone3 = row['PHONE'].substring(7);
				}else if(row['PHONE'].length == 10){
					phone1 = row['PHONE'].substring(0, 3);
					phone2 = row['PHONE'].substring(3, 6);
					phone3 = row['PHONE'].substring(6);
				}else{
					phone1 = "010";
					phone2 = "0000";
					phone3 = "0000";
				}
				$(".northContent").empty();
				// 가져온 리절트 셋으로 수정 폼 작성
				var fullTag =
					"<INPUT type='button' value='수정하기' onClick='JavaScript:btnModifySubmit();'>" +
					"<INPUT type='button' value='돌아가기' onClick='JavaScript:qnaSelectContentDB("+count+");'>";
					$(".northContent").append(fullTag);
				fullTag = 
					"<DIV id='modify'>" +
					"<TABLE border='1'>" +
					"<TR><TD>번호</TD><TD>" + row['COUNT'] + "</TD><TD>조회수</TD><TD>" + row['HIT'] + "</TD></TR>" +
					"<TR><TD>카테고리</TD><TD colspan='3'><SELECT class='contentCategory'>" +
	    			"<OPTION selected value='일반문의'>일반문의</OPTION>" +
	    			"<OPTION value='기술문의'>기술문의</OPTION>" +
	    			"<OPTION value='AS문의'>AS문의</OPTION>" +
	    			"<OPTION value='기타'>기타</OPTION>" +
	    			"</SELECT></TD></TR>" +
					"<TR><TD>작성자</TD><TD><INPUT type='text' class='contentWriter' size='15' maxlength='15' value='" + row['WRITER'] + "'></TD><TD>작성비밀번호</TD><TD><INPUT type='password' class='contentPasswd' size='10' maxlength='10'></TD></TR>" +
					"<TR><TD>핸드폰</TD><TD><INPUT type='tel' class='contentPhone1' size='3' maxlength='3' value='" + 	phone1  +"'>-<INPUT type='tel' class='contentPhone2' size='4' maxlength='4' value='" + phone2 + "'>-<INPUT type='tel' class='contentPhone3' size='4' maxlength='4' value='" + phone3 + "'></TD><TD>이메일</TD><TD><INPUT type='email' class='contentEmail' size='30' value='" + row['EMAIL'] + "'></TD></TR>" +
					"<TR><TD colspan='4'>제 목</TD></TR>" +
					"<TR><TD colspan='4'><INPUT type='text' class='contentSubject' size='30' value='" + row['SUBJECT'] + "'></TD></TR>" +
					"<TR><TD colspan='4'>내 용</TD></TR>" +
					"<TR><TD colspan='4'><TEXTAREA rows='10' cols='35' class='contentContent'>" + row['CONTENT'] + "</TEXTAREA></TD></TR></TABLE></DIV>";
				// 실제 태그를 숨겨있던 div에 적용
				$("#popUpContent").append(fullTag);
		    }
			// 본문을 수정했을때 발생하는 쿼리
 			function qnaUpdateContentDB(count, writer, passwd, phone, email, category, subject, content){
				db.transaction(function(tx){
					tx.executeSql("UPDATE QNA SET WRITER = ?, PASSWD = ?, PHONE = ?, EMAIL = ?, CATEGORY = ?, SUBJECT = ?, CONTENT = ? WHERE COUNT = ?", [writer, passwd, phone, email, category, subject, content, count]);
				});
			}