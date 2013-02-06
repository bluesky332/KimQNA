      var db;
      function loadDB(){
        db = window.openDatabase("myDB","1.0", "테스트용DB", 1024*1024); // 1MB
      }
      
      function loadTable(){
        db.transaction(function(tx){
          tx.executeSql("CREATE TABLE IF NOT EXISTS QNA(COUNT INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, SUBJECT TEXT NOT NULL)");
        });
      }
      
      function insertData(){
        db.transaction(function(tx){
          tx.executeSql("INSERT INTO QNA VALUES(NULL, ?)",[txtName.value]);
        });
      }
      
      function selectData(){
        db.transaction(function(tx){
          tx.executeSql("SELECT * FROM QNA",[],
            
            function(tx,result){            
              for(var i = 0; i < result.rows.length; i++){
                var row = result.rows.item(i);
                document.getElementById('table1').innerHTML +=  "<tr><td>" + row['COUNT'] + "</td><td>" + row['SUBJECT'] + "</td></tr>";
              }            
                                   
            });
            
        });
      }