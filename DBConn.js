var db;
function loadDB() {
	db = window.openDatabase("myDB", "1.0", "테스트용DB", 1024 * 1024); // 1MB
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
//		tx.executeSql("INSERT INTO QNA(COUNT, CATEGORY, SUBJECT, WRITER, ANSWER, HIT) VALUES(NULL, '카테고리1', '제목1', '작성자1', 0, 0)");//,[txtName.value]);
		tx.executeSql("INSERT INTO QNA(COUNT, WRITER, PASSWD, PHONE, EMAIL, CATEGORY, SUBJECT, CONTENT) VALUES(NULL, ?, ?, ?, ?, ?, ?, ?)", [writer, passwd, phone, email, category, subject, content]);

	});
}
      
function selectList(){
	db.transaction(function(tx){
		tx.executeSql("SELECT COUNT, CATEGORY, SUBJECT, WRITER, ANSWER, WDATE, HIT FROM QNA",[],
			function(tx,result){            
				for(var i = 0; i < result.rows.length; i++){
					var row = result.rows.item(i);
					document.getElementById('board').innerHTML +=  "<TR><TD><A HREF=content.html?count=" + row['COUNT'] + ">" + row['COUNT'] + "</A></TD><TD>" + row['CATEGORY'] + "</TD><TD>" + row['SUBJECT'] + "</TD><TD>" + row['WRITER'] + "</TD><TD>" + row['ANSWER'] + "</TD><TD>" + row['WDATE'] + "</TD><TD>" + row['HIT'] + "</TD></TR>";
				}            
			}
		);
	});
}

function selectContent(count){
	db.transaction(function(tx){
		tx.executeSql("SELECT * FROM QNA WHERE COUNT = ?",[count],
			function(tx,result){
				var arr = new Array();
				for(var i = 0; i < result.rows.length; i++){
					var row = result.rows.item(i);
					
					arr['COUNT'] = row['COUNT'];
					arr['CATEGORY'] = row['CATEGORY'];
					alert(row['CATEGORY']);
					document.getElementById('board').innerHTML +=  "<TR><TD><A HREF=content.html?count=" + row['COUNT'] + ">" + row['COUNT'] + "</A></TD><TD>" + row['CATEGORY'] + "</TD><TD>" + row['SUBJECT'] + "</TD><TD>" + row['WRITER'] + "</TD><TD>" + row['ANSWER'] + "</TD><TD>" + row['WDATE'] + "</TD><TD>" + row['HIT'] + "</TD></TR>";
				}
			}
		);
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
