			////////////////////////////////////////////////////////////
			// 본문의 리플 SELECT
			////////////////////////////////////////////////////////////
			// 리플 쿼리 실행
			function commentSelectDB(count){
				db.transaction(function(tx){
					tx.executeSql("SELECT * FROM COMMENT WHERE QNACNT = ? ORDER BY WDATE ASC", [count], commentSelectOK, errorDB);
				}, errorDB);
			}
			
			// 게시판의 본문 아래에 리플 출력
 			function commentSelectOK(tx, results) {
				var length = results.rows.length;		
 				var fullTag = "";//"<TABLE border='1'>";
				for(var i = 0; i < length ; i++){
					var row = results.rows.item(i);
					fullTag +=
			 			"<TR align='center'><TD>작성자</TD><TD>" + row['WRITER'] + "</TD><TD>작성시간</TD><TD>" + row['WDATE'] + "</TD></TR>" +
			 			"<TR align='center'><TD class='commentSubject'>내 용</TD><TD colspan='2' class='commentContentForm'>" + row['CONTENT'] + "</TD>" +
						"<TD value='dd'><INPUT type='button' value='수정' class='commentModify'><BR><INPUT type='button' value='삭제' class='commentDelete'><INPUT type='hidden' value="+row['COUNT']+"></TD></TR>";	
				}
				$("#comment").append(fullTag);
				$("#comment").append("</TABLE></TD></TR></TABLE>");
				replyCheckListener();
		    } 
			
			////////////////////////////////////////////////////////////
			// 본문의 리플 INSERT
			////////////////////////////////////////////////////////////
			// 리플 작성시 인서트시키는 쿼리
			function commentInsertDB(count, writer, passwd, content){
				db.transaction(function(tx){
					tx.executeSql("INSERT INTO COMMENT(QNACNT, WRITER, PASSWD, CONTENT, WDATE) VALUES(?, ?, ?, ?, datetime('now', 'localtime'))", [count, writer, passwd, content]);
				}, errorDB);
			}
			
			////////////////////////////////////////////////////////////
			// 본문 리플 삭제 SELECT & DELETE
			////////////////////////////////////////////////////////////
			// 본문 리플에 대한 쿼리 및 로직
 			function commentDeleteDB(qnacnt, cnt, passwd){
				db.transaction(function(tx){
					tx.executeSql("SELECT PASSWD FROM COMMENT WHERE QNACNT = ? AND COUNT = ? AND PASSWD = ?", [qnacnt, cnt, passwd],
						function(tx, results){
							var length = results.rows.length;
							// QNACNT, COUNT, PASSWD 일치
							if(length == 1){
								// 삭제는 정말 삭제할지 다시 물음
								if(confirm('정말 삭제하시겠습니까?')){
									// 해당 리플 삭제
		 	 						commentDelete(qnacnt, cnt, passwd);
		 	 						// 폼을 재출력
		 	 						qnaSelectContentDB(qnacnt);
								}else{
									alert('삭제가 취소되었습니다.');
		 	 						qnaSelectContentDB(qnacnt);
								}
							// QNACNT, COUNT, PASSWD 불일치
							}else if(length == 0){
								// 안내 메시지 출력
								alert('비밀번호가 맞지 않습니다.');
	 	 						qnaSelectContentDB(qnacnt);

							}
				    	}, errorDB
				    );
				}, errorDB);
			}
			
			// 본문글을 삭제했을때 발생하는 쿼리
 			function commentDelete(qnacnt, cnt, passwd){
 				db.transaction(function(tx){
 					tx.executeSql("DELETE FROM COMMENT WHERE QNACNT = ? AND COUNT = ? AND PASSWD = ?", [qnacnt, cnt, passwd]);
 				}, errorDB);
 			}
 			
			////////////////////////////////////////////////////////////
			// 리플 수정 SELECT & UPDATE
			////////////////////////////////////////////////////////////
			// 리플 수정에 대한 쿼리 및 로직
			function commentModifyDB(qnacnt, cnt, passwd, curTd){
				db.transaction(function(tx){
					tx.executeSql("SELECT PASSWD FROM COMMENT WHERE QNACNT = ? AND COUNT = ? AND PASSWD = ?", [qnacnt, cnt, passwd],
						function(tx, results){
							var length = results.rows.length;
							// QNACNT, COUNT, PASSWD 일치
							if(length == 1){
								// 테이블 수정을 위해 tr의 위치를 저장
								var curTr = curTd.parent();
								// 본문 수정을 위해 기존값을 가져온다
								var textAreaText = curTr.children('td.commentContentForm').text();
								// 테이블의 해당 지점을 비우고 아래 수정 폼으로 채운다
								curTr.children('td.commentSubject').empty().append("<H3>수정모드</H3>");
								curTr.children('td.commentContentForm').empty().append("<TEXTAREA rows='5' cols='40'>"+textAreaText+"</TEXTAREA>");
								curTd.empty().append("<INPUT type='button' value='수정완료' class='commentModifyOK'><INPUT type='hidden' value="+cnt+"><INPUT type='button' value='수정취소' class='commentModifyCancel'>");
								// 각 버튼에 이벤트를 등록
								replyModifyListener();
							// QNACNT, COUNT, PASSWD 불일치
							}else if(length == 0){
								// 안내 메시지 출력
								alert('비밀번호가 맞지 않습니다.');	
	 	 						qnaSelectContentDB(qnacnt);
							}
				    	}, errorDB
				    );
				}, errorDB);
			}
			
			// 리플을 수정했을때 발생하는 쿼리
 			function commentUpdateDB(qnacnt, cnt, content){
				db.transaction(function(tx){
					tx.executeSql("UPDATE COMMENT SET CONTENT = ? WHERE QNACNT = ? AND COUNT = ?", [content, qnacnt, cnt]);
				});
			}