			////////////////////////////////////////////////////////////
			// ������ ���� SELECT
			////////////////////////////////////////////////////////////
			// ���� ���� ����
			function commentSelectDB(count){
				db.transaction(function(tx){
					tx.executeSql("SELECT * FROM COMMENT WHERE QNACNT = ? ORDER BY WDATE ASC", [count], commentSelectOK, errorDB);
				}, errorDB);
			}
			
			// �Խ����� ���� �Ʒ��� ���� ���
 			function commentSelectOK(tx, results) {
				var length = results.rows.length;		
 				var fullTag = "";//"<TABLE border='1'>";
				for(var i = 0; i < length ; i++){
					var row = results.rows.item(i);
					fullTag +=
			 			"<TR align='center'><TD>�ۼ���</TD><TD>" + row['WRITER'] + "</TD><TD>�ۼ��ð�</TD><TD>" + row['WDATE'] + "</TD></TR>" +
			 			"<TR align='center'><TD class='commentSubject'>�� ��</TD><TD colspan='2' class='commentContentForm'>" + row['CONTENT'] + "</TD>" +
						"<TD value='dd'><INPUT type='button' value='����' class='commentModify'><BR><INPUT type='button' value='����' class='commentDelete'><INPUT type='hidden' value="+row['COUNT']+"></TD></TR>";	
				}
				$("#comment").append(fullTag);
				$("#comment").append("</TABLE></TD></TR></TABLE>");
				replyCheckListener();
		    } 
			
			////////////////////////////////////////////////////////////
			// ������ ���� INSERT
			////////////////////////////////////////////////////////////
			// ���� �ۼ��� �μ�Ʈ��Ű�� ����
			function commentInsertDB(count, writer, passwd, content){
				db.transaction(function(tx){
					tx.executeSql("INSERT INTO COMMENT(QNACNT, WRITER, PASSWD, CONTENT, WDATE) VALUES(?, ?, ?, ?, datetime('now', 'localtime'))", [count, writer, passwd, content]);
				}, errorDB);
			}
			
			////////////////////////////////////////////////////////////
			// ���� ���� ���� SELECT & DELETE
			////////////////////////////////////////////////////////////
			// ���� ���ÿ� ���� ���� �� ����
 			function commentDeleteDB(qnacnt, cnt, passwd){
				db.transaction(function(tx){
					tx.executeSql("SELECT PASSWD FROM COMMENT WHERE QNACNT = ? AND COUNT = ? AND PASSWD = ?", [qnacnt, cnt, passwd],
						function(tx, results){
							var length = results.rows.length;
							// QNACNT, COUNT, PASSWD ��ġ
							if(length == 1){
								// ������ ���� �������� �ٽ� ����
								if(confirm('���� �����Ͻðڽ��ϱ�?')){
									// �ش� ���� ����
		 	 						commentDelete(qnacnt, cnt, passwd);
		 	 						// ���� �����
		 	 						qnaSelectContentDB(qnacnt);
								}else{
									alert('������ ��ҵǾ����ϴ�.');
		 	 						qnaSelectContentDB(qnacnt);
								}
							// QNACNT, COUNT, PASSWD ����ġ
							}else if(length == 0){
								// �ȳ� �޽��� ���
								alert('��й�ȣ�� ���� �ʽ��ϴ�.');
	 	 						qnaSelectContentDB(qnacnt);

							}
				    	}, errorDB
				    );
				}, errorDB);
			}
			
			// �������� ���������� �߻��ϴ� ����
 			function commentDelete(qnacnt, cnt, passwd){
 				db.transaction(function(tx){
 					tx.executeSql("DELETE FROM COMMENT WHERE QNACNT = ? AND COUNT = ? AND PASSWD = ?", [qnacnt, cnt, passwd]);
 				}, errorDB);
 			}
 			
			////////////////////////////////////////////////////////////
			// ���� ���� SELECT & UPDATE
			////////////////////////////////////////////////////////////
			// ���� ������ ���� ���� �� ����
			function commentModifyDB(qnacnt, cnt, passwd, curTd){
				db.transaction(function(tx){
					tx.executeSql("SELECT PASSWD FROM COMMENT WHERE QNACNT = ? AND COUNT = ? AND PASSWD = ?", [qnacnt, cnt, passwd],
						function(tx, results){
							var length = results.rows.length;
							// QNACNT, COUNT, PASSWD ��ġ
							if(length == 1){
								// ���̺� ������ ���� tr�� ��ġ�� ����
								var curTr = curTd.parent();
								// ���� ������ ���� �������� �����´�
								var textAreaText = curTr.children('td.commentContentForm').text();
								// ���̺��� �ش� ������ ���� �Ʒ� ���� ������ ä���
								curTr.children('td.commentSubject').empty().append("<H3>�������</H3>");
								curTr.children('td.commentContentForm').empty().append("<TEXTAREA rows='5' cols='40'>"+textAreaText+"</TEXTAREA>");
								curTd.empty().append("<INPUT type='button' value='�����Ϸ�' class='commentModifyOK'><INPUT type='hidden' value="+cnt+"><INPUT type='button' value='�������' class='commentModifyCancel'>");
								// �� ��ư�� �̺�Ʈ�� ���
								replyModifyListener();
							// QNACNT, COUNT, PASSWD ����ġ
							}else if(length == 0){
								// �ȳ� �޽��� ���
								alert('��й�ȣ�� ���� �ʽ��ϴ�.');	
	 	 						qnaSelectContentDB(qnacnt);
							}
				    	}, errorDB
				    );
				}, errorDB);
			}
			
			// ������ ���������� �߻��ϴ� ����
 			function commentUpdateDB(qnacnt, cnt, content){
				db.transaction(function(tx){
					tx.executeSql("UPDATE COMMENT SET CONTENT = ? WHERE QNACNT = ? AND COUNT = ?", [content, qnacnt, cnt]);
				});
			}