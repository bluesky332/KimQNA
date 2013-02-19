function insertData(writer, passwd, phone, email, category, subject, content){
	db.transaction(function(tx){
		tx.executeSql("INSERT INTO QNA(COUNT, WRITER, PASSWD, PHONE, EMAIL, CATEGORY, SUBJECT, CONTENT, WDATE) VALUES(NULL, ?, ?, ?, ?, ?, ?, ?, datetime('now', 'localtime'))", [writer, passwd, phone, email, category, subject, content]);
	});
}


			////////////////////////////////////////////////////////////
			// �Խ��� ����Ʈ SELECT
			////////////////////////////////////////////////////////////
			// �Խ��� ����Ʈ ���. �������Ǻ�
 			function selectList(){
				db.transaction(function(tx){
					tx.executeSql("SELECT COUNT(*) AS CNT FROM QNA", [],
						function(tx, results){
							var row = results.rows.item(0);
							var cnt = row['CNT'];
							var perPage = 5; // �������� �ۼ�
							var totPage; // �� ��������
							var start = 0;
							// �Խù��� ������ ������ ����
						    if((cnt % perPage) == 0){
						    	totPage = parseInt((cnt / perPage));
						    }else{
						    	totPage = parseInt((cnt / perPage + 1));
						    }
						    // ������ �ʱ�ȭ
						    $(".northContent").empty();
						    $(".list").remove();
						    $(".pageNum").remove();
							// ������������ �Խ��� �Ʒ��� ���
						    var fullTag = "";
							for(var i = 1 ; i <= totPage ; i++){
								fullTag += "<TD class='pageNum' style='cursor:pointer'>["+i+"]</TD>";	
							}

							$(".pageTable").append(fullTag);
							$(".pageTable > td").first().css({"color": "red", "font-weight": "bold"});
							// �ʱ�  ù������ ����Ʈ ���
							qnaSelectListDB(start, perPage);
							// ������ Ŭ���� ���� �̺�Ʈ ����
							pageListener();
				    	}, errorDB
				    );
				}, errorDB);
			}
 			
		    // �������� �Խù��� ������ ���̺� ���
 			function qnaSelectListDB(start, perPage){
				db.transaction(function(tx){
					// ���� ����
					tx.executeSql("SELECT COUNT, WRITER, CATEGORY, SUBJECT, WDATE, ANSWER, HIT FROM QNA ORDER BY WDATE DESC LIMIT ? OFFSET ?", [perPage, start],
						function(tx, results){
						var length = results.rows.length;
						var fullTag = "";
						// ���̺� �ش� �������� ������ ���
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
						// �Խñ� Ŭ���� ���� �̺�Ʈ ����
						contentListener();
				    	}, errorDB
				    );
				}, errorDB);
			}
 			
			////////////////////////////////////////////////////////////
			// �Խ��� �˻� SELECT
			////////////////////////////////////////////////////////////
		    // �˻���� ���
 			function selectSearchDB(type, search){
				db.transaction(function(tx){
					// ���� ����
					tx.executeSql("SELECT COUNT, WRITER, CATEGORY, SUBJECT, WDATE, ANSWER, HIT FROM QNA WHERE " + type + " LIKE '%"+search+"%' ORDER BY WDATE DESC", [],
						function(tx, results){
						var length = results.rows.length;
						var fullTag = "";
						// ���̺� �ش� �������� ������ ���
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
						// �Խñ� Ŭ���� ���� �̺�Ʈ ����
						contentListener();
				    	}, errorDB
				    );
				}, errorDB);
			}
 			
			////////////////////////////////////////////////////////////
			// �Խ��� ���� SELECT
			////////////////////////////////////////////////////////////
			// �Խ��� ���� ��������
			function qnaSelectContentDB(count){
				db.transaction(function(tx){
					tx.executeSql("SELECT * FROM QNA WHERE COUNT = ?", [count], qnaSelectContentOK, errorDB);
				}, errorDB);
			}
			
			// �Խ��� ���� ���
			function qnaSelectContentOK(tx, results) {
				// ���� ������ �ִٸ� ����
	 			$("#content").remove();
	 			$("#modify").remove();
	 			// ����Ʈ
				var length = results.rows.length;
				var row = results.rows.item(0);
				var count = row['COUNT'];
				// �Խ��� ���� ����
				$(".northContent").empty();
				var fullTag =
					"<INPUT type='button' value='�����ϱ�' id='modify' onClick=JavaScript:btnContentCheck('modify');this.disabled=true>" +
					"<INPUT type='button' value='�����ϱ�' id='delete' onClick=JavaScript:btnContentCheck('delete');this.disabled=true>";
				$(".northContent").append(fullTag);
				fullTag = 
					"<DIV id='content'>" +
					"<INPUT type='hidden' name='test3' value="+count+">" +
					"<TABLE border='1' style=width:100%>" +
					"<TR align='center'>" +
					"<TH>��ȣ</TH>" +
					"<TH>ī�װ�</TH>" +
					"<TH>����</TH>" +
					"<TH>�̸�</TH>" +
					"<TH>�亯����</TH>" +
					"<TH>�ۼ��ð�</TH>" +
					"<TH>��ȸ��</TH>" +
					"</TR>" +
					"<TR align='center'>" +
					"<TD>" + row['COUNT'] + "</TD>" +
					"<TD>" + row['CATEGORY'] + "</TD><TD>" + row['SUBJECT'] + "</TD><TD>" + row['WRITER'] + "</TD>" +
					"<TD>" + row['ANSWER'] + "</TD><TD>" + row['WDATE'] + "</TD><TD>" + row['HIT'] + "</TD></TR>" +
					"<TR align='center'><TD colspan='7'><TABLE border='1' id='comment' style=width:100%>" +
					"<TR align='center'><TD>�ڵ���</TD><TD>" + row['PHONE'] + "</TD><TD>�̸���</TD><TD>" + row['EMAIL'] + "</TD></TR>" +
					"<TR align='center'><TD colspan='4'>�� ��</TD></TR>" +
					"<TR align='center'><TD colspan='4'>" + row['SUBJECT'] + "</TD></TR>" +
					"<TR align='center'><TD colspan='4'>�� ��</TD></TR>" +
					"<TR align='center'><TD colspan='4'>" + row['CONTENT'] + "</TD></TR>" +
					"<TR align='center'><TD>�̸�<BR><INPUT type='text' class='commentWriter' size='15' maxlength='15'>" +
					"<BR>��й�ȣ<BR><INPUT type='password' class='commentPasswd' size='10' maxlength='10'></TD>" +
					"<TD colspan='2'><TEXTAREA rows='5' cols='40' class='commentContent'>������ �ۼ��ϼ���.</TEXTAREA></TD>" +
					"<TD><INPUT type='button' value='�ۼ�' onClick='JavaScript:btnWriteComment("+row['COUNT']+");this.disabled=true'></TD></TR>"+
					"</TABLE></TD></TR></TABLE></DIV>";
				// ���� �±׸� �����ִ� div�� ����
				$("#popUpContent").append(fullTag);
				// �����ۼ��� ���� textArea Ŭ���� ������ �����
 	 			$(".commentContent").click(function(e) {
 	 				$(this).text("");
	 			});
	 			
				// �Խñۿ� �´� ���� ���� ȣ��
				commentSelectDB(count);
		    }
			
			////////////////////////////////////////////////////////////
			// �Խñ� ���� SELECT & DELETE
			////////////////////////////////////////////////////////////
			// �Խñ� ������ ���� ���� �� ����
			function qnaDeleteDB(count, passwd){
				db.transaction(function(tx){
					tx.executeSql("SELECT PASSWD FROM QNA WHERE COUNT = ? AND PASSWD = ?", [count, passwd],
						function(tx, results){
							var length = results.rows.length;
							// COUNT, PASSWD ��ġ
							if(length == 1){
								// ������ ���� �������� �ٽ� ����
								if(confirm('���� �����Ͻðڽ��ϱ�?')){
									// �Խñ� �� �Խñۿ� �ش��ϴ� ���� ����
		 	 						qnaDeleteContent(count, passwd);
		 	 						commentDeleteContent(count);
		 	 						// ���� ���� �����ϰ� list�� �����
		 	 	 					$('#popUpContent').empty();
		 	 	 					$(".northContent").empty();
		 	 	 					$(".list").remove();
		 	 	 					selectList();
								}else{
									alert('������ ��ҵǾ����ϴ�.');
									qnaSelectContentDB(count);
								}
							// COUNT, PASSWD ����ġ
							}else if(length == 0){
								// �ȳ� �޽��� ���
								alert('��й�ȣ�� ���� �ʽ��ϴ�.');
								qnaSelectContentDB(count);
							}
				    	}, errorDB
				    );
				}, errorDB);
			}
			
			// �������� ���������� �߻��ϴ� ����
 			function qnaDeleteContent(count, passwd){
 				db.transaction(function(tx){
 					tx.executeSql("DELETE FROM QNA WHERE COUNT = ? AND PASSWD = ?", [count, passwd]);
 				}, errorDB);
 			}
			
			// �������� ���������� ���� ���õ� ��� �����ϴ� ����
 			function commentDeleteContent(count){
 				db.transaction(function(tx){
 					tx.executeSql("DELETE FROM COMMENT WHERE QNACNT = ?", [count]);//, [writer, passwd, phone, email, category, subject, content]);
 				}, errorDB);
 			}
 			
			////////////////////////////////////////////////////////////
			// �Խñ� ���� SELECT & UPDATE
			////////////////////////////////////////////////////////////
			// �Խñ� ������ ���� ���� �� ����
			function qnaModifyDB(count, passwd){
				db.transaction(function(tx){
					tx.executeSql("SELECT PASSWD FROM QNA WHERE COUNT = ? AND PASSWD = ?", [count, passwd],
						function(tx, results){
							var length = results.rows.length;
							// COUNT, PASSWD ��ġ
							if(length == 1){
								// ������ ���� ������ �ٽ� ������� �Լ�
								qnaModifyContentDB(count, passwd);
							// COUNT, PASSWD ����ġ
							}else if(length == 0){
								// �ȳ� �޽��� ���
								alert('��й�ȣ�� ���� �ʽ��ϴ�.');	
								qnaSelectContentDB(count);
							}
				    	}, errorDB
				    );
				}, errorDB);
			}

			// �Խñ� ������ �������� ���� ����
			function qnaModifyContentDB(count, passwd){
				db.transaction(function(tx){
					tx.executeSql("SELECT * FROM QNA WHERE COUNT = ? AND PASSWD = ?", [count, passwd], qnaModifyContentOK, errorDB);
				}, errorDB);
			}
			
			// �Խñ� ������ ������ ������ �� �ִ� ���� ����� �ش� ���� ������ ��ġ
			function qnaModifyContentOK(tx, results) {
				// ���ο� �� �ۼ��� ���� ���� ������ ����
				$("#content").remove();
				$("#modify").remove();
				// ����Ʈ
				var length = results.rows.length;
				var row = results.rows.item(0);
				var count = row['COUNT'];
				// �ڵ��� ����ó��
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
				// ������ ����Ʈ ������ ���� �� �ۼ�
				var fullTag =
					"<INPUT type='button' value='�����ϱ�' onClick='JavaScript:btnModifySubmit();'>" +
					"<INPUT type='button' value='���ư���' onClick='JavaScript:qnaSelectContentDB("+count+");'>";
					$(".northContent").append(fullTag);
				fullTag = 
					"<DIV id='modify'>" +
					"<TABLE border='1'>" +
					"<TR><TD>��ȣ</TD><TD>" + row['COUNT'] + "</TD><TD>��ȸ��</TD><TD>" + row['HIT'] + "</TD></TR>" +
					"<TR><TD>ī�װ�</TD><TD colspan='3'><SELECT class='contentCategory'>" +
	    			"<OPTION selected value='�Ϲݹ���'>�Ϲݹ���</OPTION>" +
	    			"<OPTION value='�������'>�������</OPTION>" +
	    			"<OPTION value='AS����'>AS����</OPTION>" +
	    			"<OPTION value='��Ÿ'>��Ÿ</OPTION>" +
	    			"</SELECT></TD></TR>" +
					"<TR><TD>�ۼ���</TD><TD><INPUT type='text' class='contentWriter' size='15' maxlength='15' value='" + row['WRITER'] + "'></TD><TD>�ۼ���й�ȣ</TD><TD><INPUT type='password' class='contentPasswd' size='10' maxlength='10'></TD></TR>" +
					"<TR><TD>�ڵ���</TD><TD><INPUT type='tel' class='contentPhone1' size='3' maxlength='3' value='" + 	phone1  +"'>-<INPUT type='tel' class='contentPhone2' size='4' maxlength='4' value='" + phone2 + "'>-<INPUT type='tel' class='contentPhone3' size='4' maxlength='4' value='" + phone3 + "'></TD><TD>�̸���</TD><TD><INPUT type='email' class='contentEmail' size='30' value='" + row['EMAIL'] + "'></TD></TR>" +
					"<TR><TD colspan='4'>�� ��</TD></TR>" +
					"<TR><TD colspan='4'><INPUT type='text' class='contentSubject' size='30' value='" + row['SUBJECT'] + "'></TD></TR>" +
					"<TR><TD colspan='4'>�� ��</TD></TR>" +
					"<TR><TD colspan='4'><TEXTAREA rows='10' cols='35' class='contentContent'>" + row['CONTENT'] + "</TEXTAREA></TD></TR></TABLE></DIV>";
				// ���� �±׸� �����ִ� div�� ����
				$("#popUpContent").append(fullTag);
		    }
			// ������ ���������� �߻��ϴ� ����
 			function qnaUpdateContentDB(count, writer, passwd, phone, email, category, subject, content){
				db.transaction(function(tx){
					tx.executeSql("UPDATE QNA SET WRITER = ?, PASSWD = ?, PHONE = ?, EMAIL = ?, CATEGORY = ?, SUBJECT = ?, CONTENT = ? WHERE COUNT = ?", [writer, passwd, phone, email, category, subject, content, count]);
				});
			}