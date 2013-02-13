var db;
function loadDB() {
	db = window.openDatabase("myDB", "1.0", "testDB", 1024 * 1024); // 1MB
}
      // TABLE = COUNT, WRITER, PASSWD, PHONE, EMAIL, CATEGORY, SUBJECT, CONTENT, WDATE, ANSWER, HIT
function loadTable(){
	db.transaction(function(tx){
		tx.executeSql("CREATE TABLE IF NOT EXISTS QNA(COUNT INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, WRITER TEXT NOT NULL, PASSWD TEXT NOT NULL, " +
				"PHONE TEXT NOT NULL, EMAIL TEXT NOT NULL, CATEGORY TEXT NOT NULL, SUBJECT TEXT NOT NULL, CONTENT NOT NULL, " +
				"WDATE TEXT DEFAULT current_timestamp NOT NULL, ANSWER INTEGER DEFAULT 0 NOT NULL, HIT INTEGER DEFAULT 0 NOT NULL)");
	});
}

function insertData(writer, passwd, phone, email, category, subject, content){
	db.transaction(function(tx){
		tx.executeSql("INSERT INTO QNA(COUNT, WRITER, PASSWD, PHONE, EMAIL, CATEGORY, SUBJECT, CONTENT) VALUES(NULL, ?, ?, ?, ?, ?, ?, ?)", [writer, passwd, phone, email, category, subject, content]);
	});
}
      
function selectList(){
	db.transaction(function(tx){
		tx.executeSql("SELECT * FROM QNA",[],
			function(tx,result){            
				for(var i = 0; i < result.rows.length; i++){
					var row = result.rows.item(i);
					document.getElementById('board').innerHTML +=  "<TR id='list" + row['COUNT'] + "'>" +
						"<TD><A HREF=content.html?count=" + row['COUNT'] + ">" + row['COUNT'] + "</A></TD>" +
						"<TD>" + row['CATEGORY'] + "</TD><TD>" + row['SUBJECT'] + "</TD><TD>" + row['WRITER'] + "</TD>" +
						"<TD>" + row['ANSWER'] + "</TD><TD>" + row['WDATE'] + "</TD><TD>" + row['HIT'] + "</TD></TR>" +
						"<TR width='0' height='0'><TD colspan='7'><DIV id='content" + row['COUNT'] + "'><TABLE border='1'><TR><TD>번호</TD><TD>" + row['COUNT'] + "</TD>" +
						"<TD>조회수</TD><TD>" + row['HIT'] + "</TD></TR>" +
						"<TR><TD>카테고리</TD><TD>" + row['CATEGORY'] + "</TD><TD>작성시간</TD><TD>" + row['WDATE'] + "</TD></TR>" +
						"<TR><TD>작성자</TD><TD colspan='3'>" + row['WRITER'] + "</TD></TR>" +
						"<TR><TD>핸드폰</TD><TD>" + row['PHONE'] + "</TD><TD>이메일</TD><TD>" + row['EMAIL'] + "</TD></TR>" +
						"<TR><TD colspan='4'>제 목</TD></TR>" +
						"<TR><TD colspan='4'>" + row['SUBJECT'] + "</TD></TR>" +
						"<TR><TD colspan='4'>내 용</TD></TR>" +
						"<TR><TD colspan='4'>" + row['CONTENT'] + "</TD></TR></TABLE></DIV></TD></TR>";
					$("#content" + row['COUNT']).hide();
					document.getElementById('aa').value++;
				}
			}
		);
	});
}

/*function selectList(){
	db.transaction(function(tx){
		tx.executeSql("SELECT COUNT, CATEGORY, SUBJECT, WRITER, ANSWER, WDATE, HIT FROM QNA",[],
			function(tx,result){            
				for(var i = 0; i < result.rows.length; i++){
					var row = result.rows.item(i);
					document.getElementById('board').innerHTML +=  "<DIV id='a'><TR><TD><A HREF=content.html?count=" + row['COUNT'] + ">" + row['COUNT'] + "</A></TD><TD>" + row['CATEGORY'] + "</TD><TD>" + row['SUBJECT'] + "</TD><TD>" + row['WRITER'] + "</TD><TD>" + row['ANSWER'] + "</TD><TD>" + row['WDATE'] + "</TD><TD>" + row['HIT'] + "</TD></TR></DIV>";
				}
			}
		);
	});
}*/

function selectContent(count){
	db.transaction(function(tx){
		tx.executeSql("SELECT * FROM QNA WHERE COUNT = ?",[count],
			function(tx,result){
				for(var i = 0; i < result.rows.length; i++){
					var row = result.rows.item(i);
					document.getElementById('board').innerHTML += 
						"<TR><TD>번호</TD><TD>" + row['COUNT'] + "</TD><TD>조회수</TD><TD>" + row['HIT'] + "</TD></TR>" +
						"<TR><TD>카테고리</TD><TD>" + row['CATEGORY'] + "</TD><TD>작성시간</TD><TD>" + row['WDATE'] + "</TD></TR>" +
						"<TR><TD>작성자</TD><TD colspan='3'>" + row['WRITER'] + "</TD></TR>" +
						"<TR><TD>핸드폰</TD><TD>" + row['PHONE'] + "</TD><TD>이메일</TD><TD>" + row['EMAIL'] + "</TD></TR>" +
						"<TR><TD colspan='4'>제 목</TD></TR>" +
						"<TR><TD colspan='4'>" + row['SUBJECT'] + "</TD></TR>" +
						"<TR><TD colspan='4'>내 용</TD></TR>" +
						"<TR><TD colspan='4'>" + row['CONTENT'] + "</TD></TR>";
				}
			}
		);
	});
	db.close();
}

function selectModify(count){
	db.transaction(function(tx){
		tx.executeSql("SELECT * FROM QNA WHERE COUNT = ?",[count],
			function(tx,result){
				for(var i = 0; i < result.rows.length; i++){
					var row = result.rows.item(i);
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
					
					document.getElementById('board').innerHTML += 
						"<TR><TD>번호</TD><TD>" + row['COUNT'] + "</TD><TD>조회수</TD><TD>" + row['HIT'] + "</TD></TR>" +
						"<TR><TD>카테고리</TD><TD colspan='3'><SELECT name='category'>" +
    					"<OPTION selected value='일반문의'>일반문의</OPTION>" +
    					"<OPTION value='기술문의'>기술문의</OPTION>" +
    					"<OPTION value='AS문의'>AS문의</OPTION>" +
    					"<OPTION value='기타'>기타</OPTION>" +
    					"</SELECT></TD></TR>" +
						"<TR><TD>작성자</TD><TD><INPUT type='text' name='writer' size='15' maxlength='15' value='" + row['WRITER'] + "'></TD><TD>작성비밀번호</TD><TD><INPUT type='password' name='passwd' size='10' maxlength='10'></TD></TR>" +
						"<TR><TD>핸드폰</TD><TD><INPUT type='tel' name='phone1' size='3' maxlength='3' value='" + 	phone1  +"'>-<INPUT type='tel' name='phone2' size='4' maxlength='4' value='" + phone2 + "'>-<INPUT type='tel' name='phone3' size='4' maxlength='4' value='" + phone3 + "'></TD><TD>이메일</TD><TD><INPUT type='email' name='email' size='30' value='" + row['EMAIL'] + "'></TD></TR>" +
						"<TR><TD colspan='4'>제 목</TD></TR>" +
						"<TR><TD colspan='4'><INPUT type='text' name='subject' size='30' value='" + row['SUBJECT'] + "'></TD></TR>" +
						"<TR><TD colspan='4'>내 용</TD></TR>" +
						"<TR><TD colspan='4'><TEXTAREA rows='10' cols='35' name='content' value='" + row['CONTENT'] + "'></TEXTAREA></TD></TR>";
				}
			}
		);
	});
}

function updateContent(count, writer, passwd, phone, email, category, subject, content){
 	//loadDB();
	//loadTable();
	alert('!');
	db.transaction(function(tx){
		tx.executeSql("UPDATE QNA SET WRITER = ?, PASSWD = ?, PHONE = ?, EMAIL = ?, CATEGORY = ?, SUBJECT = ?, CONTENT = ? WHERE COUNT = ?", [writer, passwd, phone, email, category, subject, content, count]);
		//tx.executeSql("UPDATE QNA SET WRITER = '2', PASSWD = '2', PHONE = '2', EMAIL = '2@', CATEGORY = '2', SUBJECT = '2', CONTENT = '2' WHERE COUNT = 1");
		//tx.executeSql("UPDATE QNA SET WRITER=" + test + ")");
	});
	alert('*');
	db.close();
}



function deleteContent(count){
	db.transaction(function(tx){
		tx.executeSql("DELETE FROM QNA WHERE COUNT = ?", [count]);//, [writer, passwd, phone, email, category, subject, content]);
	});
}

//
var Request = function() {
		    this.getParameter = function( name ) {
		        var rtnval = '';
		        var nowAddress = unescape(location.href);
		        var parameters = (nowAddress.slice(nowAddress.indexOf('?')+1,nowAddress.length)).split('&');
		        for(var i = 0 ; i < parameters.length ; i++)
		        {
		            var varName = parameters[i].split('=')[0];
		            if(varName.toUpperCase() == name.toUpperCase())
		            {
		                rtnval = parameters[i].split('=')[1];
		                break;
		            }
		        }
		        return rtnval;
		    };
		};
