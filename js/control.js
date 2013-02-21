			// DB �ʱ⼳��
			function initDB(tx) {
				// QNA ���̺� ����
        		tx.executeSql("CREATE TABLE IF NOT EXISTS QNA(COUNT INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, WRITER TEXT NOT NULL, PASSWD TEXT NOT NULL, " +
					"PHONE TEXT NOT NULL, EMAIL TEXT NOT NULL, CATEGORY TEXT NOT NULL, SUBJECT TEXT NOT NULL, CONTENT NOT NULL, " +
					"WDATE TEXT NOT NULL, ANSWER INTEGER DEFAULT 0 NOT NULL, HIT INTEGER DEFAULT 0 NOT NULL)");
				// COMMENT ���̺� ����
	        	tx.executeSql("CREATE TABLE IF NOT EXISTS COMMENT(COUNT INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, QNACNT INTEGER NOT NULL," +
	        		"WRITER TEXT NOT NULL, PASSWD TEXT NOT NULL, CONTENT NOT NULL, WDATE TEXT NOT NULL)");
			}
			// DB ������ ������ ������ ��
			function errorDB(err) {
	        	console.log("Error processing SQL: "+err.code);
	    	}

 			
			////////////////////////////////////////////////////////////
			// ������� �Ϲ� �Լ�
			////////////////////////////////////////////////////////////
			// [���۾���]�� �̷�
			function btnWritePage(){
				$("#popUpContent").empty();
				$('.northContent').empty();
				$("#newWrite").show();
			}

			// ���۾��� ������ [�ۼ��Ϸ�]��ư Ŭ����
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
				form.category.value = "�Ϲݹ���";
				form.phone1.value = "";
				form.phone2.value = "";
				form.phone3.value = "";
				form.email.value = "";
				form.subject.value = "";
				form.content.value = "";
				insertData(writer, passwd, phone, email, category, subject, content);
				// �۾���â ����
				$("#newWrite").hide();
				// ����Ʈ ���ΰ�ħ
				$(".list").remove();
				selectList();
 			}
			
			// ������ Ŭ���� ���� �̺�Ʈ ó��
 			function pageListener(){
 	 			$(".pageNum").click(function(e) {
 	 				// Ŭ���� ���� �������� ��������ȣ�� ����
 	 				var str = $(this).text();
					var curPage = str.replace(/[^0-9]/g, "");
					var perPage = 5;
					// �����ϴ� �۹�ȣ �Ǵ�
					var start = (curPage-1) * perPage;
					// �������� ȿ���ֱ�. ���� �������� ���� ǥ��
					$(this).parent().children().css({"color": "black", "font-weight": "normal"});
					$(this).css({"color": "red", "font-weight": "bold"});
					// ����Ʈ�� ������ �ִٸ� ����
	 				$('#popUpContent').empty();
					$('.northContent').empty();
					$('.list').remove();
					// �ش� �������� ���̺��� �������� ����
					qnaSelectListDB(start, perPage);
	 			});
 			}
			
			// [�˻�]��ư Ŭ����
			function btnSearch(){
				var search = document.all.search.value;
				var type = document.all.selectSearch.value;
				if(type == "�̸�"){
					type = "WRITER";
				}else if(type == "����"){
					type = "SUBJECT";
				}else if(type == "����"){
					type = "CONTENT";
				}
 				$('#popUpContent').empty();
				$('.list').remove();
				$('.pageTable').empty();
				selectSearchDB(type, search);
			}
			
 			// ����Ʈ Ŭ���� ���� �̺�Ʈ ó��
 			function contentListener(){
 	 			$(".list").click(function(e) {
 	 				count = parseInt($(this).text());
 	 				//$("#content").remove();
 	 				var left = 650;
 	 				var top = 100;
 	 				// ������ ���� ��ȸ���� ����
 	 				qnaHitUpdateDB(count);
 	 				// ������ ���� ������ ���
 	 				qnaSelectContentDB(count);

	 				$('#newWrite').hide();
	 				$('#popUpContent').show();

	 			});
 			}
 			

	 		
 			// ������ [����], [����]�� ��й�ȣ üũ
	 		function btnContentCheck(option){
	 			var passwd = prompt("��й�ȣ�� �Է��ϼ���.");
	 			// �ɼǿ� ���� �ٸ� �Լ��� ȣ��
 	 			if(option == 'delete'){
 	 				qnaDeleteDB(count, passwd);
	 			}else if(option == 'modify'){
	 				qnaModifyDB(count, passwd);
	 			}
	 		}
	 		
 			// ������ [�����Ϸ�] ��ư Ŭ���� - ���� UPDATE
	 		function btnModifySubmit(){
 	 			var writer = $(".contentWriter").val();
	 			var passwd = $(".contentPasswd").val();
	 			var phone = $(".contentPhone1").val() + $(".contentPhone2").val() + $(".contentPhone3").val();
	 			var email = $(".contentEmail").val();
	 			var category = $(".contentCategory").val();
	 			var subject = $(".contentSubject").val();
	 			var content = $(".contentContent").val();
	 			// ������Ʈ ���� ����
	 			qnaUpdateContentDB(count, writer, passwd, phone, email, category, subject, content);
	 			alert('���� ������ �Ϸ�Ǿ����ϴ�.');
	 			qnaSelectContentDB(count);

	 		}
	 		
	 		// ������ content ���ý� ������ ���
	 		function replyListener(){
	 			$(".commentContent").click(function(e) {
	 				$(this).text("");
	 			});
	 		}
 			
 			// ������ [�ۼ�] ��ư Ŭ����
	 		function btnWriteComment(count){
	 			var writer = $(".commentWriter").val();
		    	var passwd = $(".commentPasswd").val();
		    	var content = $(".commentContent").val();
		    	// �μ�Ʈ ���� ����
	 			commentInsertDB(count, writer, passwd, content);
	 			qnaAnsUpdateDB("+",count);
		    	// ���� ���ΰ�ħ
 				qnaSelectContentDB(count);
	 		}
 			
			// ������ [����], [����]�� ���� �̺�Ʈ ó��
			function replyCheckListener(){
	 	 		$(".commentModify").click(function(e) {
	 	 			$(this).attr("disabled", "true");
	 	 			// �Խñ��� ī��Ʈ
	 	 			var qnacnt = count;
	 	 			// ������ ī��Ʈ
	 	 			var cnt = $(this).next().next().next().val();
	 	 			var passwd = prompt("��й�ȣ�� �Է��ϼ���.");
	 	 			// Ŭ�������� ��ġ������
	 	 			var curTd = $(this).parent();
	 	 			// ���ü����� ���� ���� �� ����
	 	 			commentModifyDB(qnacnt, cnt, passwd, curTd);
		 		});
		 	 	$(".commentDelete").click(function(e) {
		 	 		$(this).attr("disabled", "true");
	 	 			var qnacnt = count;
	 	 			var cnt = $(this).next().val();
	 		 		var passwd = prompt("��й�ȣ�� �Է��ϼ���.");
	 		 		// ���� ������ ���� ���� �� ����
	 	 			commentDeleteDB(qnacnt, cnt, passwd);
		 		});
			 }
			 
			// ������ ������忡�� [�����Ϸ�], [�������]�� ���� �̺�Ʈ ó��
			function replyModifyListener(){
		 	 	$(".commentModifyCancel").click(function(e) {
		 	 		$(this).attr("disabled", "true");
		 	 		var qnacnt = count;
		 	 		// ��ҽ� �ȳ��޽��� ��� �� ���� �Խñ� ���ΰ�ħ
		 			alert('���� ������ ��ҵǾ����ϴ�.');
		 			qnaSelectContentDB(qnacnt);
		 		});
		 	 	$(".commentModifyOK").click(function(e) {
		 	 		$(this).attr("disabled", "true");
		 	 		var qnacnt = count;
		 	 		var cnt = $(this).next().val();
					var content = $(this).parent().parent().children('td.commentContentForm').children('textarea').val();
					// DB�� ������ �������� ������Ʈ
		 			commentUpdateDB(qnacnt, cnt, content);
					// �ȳ� �޽��� ��� �� �Խñ� ���ΰ�ħ
		 			alert('���� ������ �Ϸ�Ǿ����ϴ�.');
		 			qnaSelectContentDB(qnacnt);
		 		});
			 }