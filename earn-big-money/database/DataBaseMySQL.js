var mysql = require('mysql');
var fs = require('fs');

/* database
var dbInfo = {
    host: "localhost",
    user: "root",
    password: "1234",
    port: "3306",
    database: "projectdb",
    timezone: "08:00"
}
*/
var configConnectionFile = "./database/Config/configConnection.json";
var dbInfo = JSON.parse(fs.readFileSync(configConnectionFile));
var configTableFile = "./database/Config/configTable.json";
var {tableInfo} = JSON.parse(fs.readFileSync(configTableFile));
var connection = undefined;

function handleDisconnect(connection) {
  connection.on('error', function(err) {
    if (!err.fatal) {
      return;
    }
    if (err.code !== 'PROTOCOL_CONNECTION_LOST') {
      throw err;
    }

    console.log('Re-connecting lost connection: ' + err.stack);
	
    connection = mysql.createConnection(connection.config);
    handleDisconnect(connection);
    connection.connect();
  });
}

var database = {
    tableDelete : function(){

        try {
            connection.query("DROP TABLE IF EXISTS userInfo;", function(error, results, fields){
                if (error) {
                    throw error;
                }
            });
        }
        catch(err){
            console.error(err);
        }
    },

    tableInit : async function(){
        try {
			
            connection = mysql.createConnection({
                host     : dbInfo.host,
                user     : dbInfo.user,
                password : dbInfo.password,
                port     : dbInfo.port
            });
			
			await new Promise((resolve, reject)=>{
				connection.query('CREATE DATABASE IF NOT EXISTS '+dbInfo.database+' character set utf8', async function(error, results, fields){
					if(error){
						throw error;
					}
					connection = mysql.createConnection({
						host     : dbInfo.host,
						user     : dbInfo.user,
						password : dbInfo.password,
						port     : dbInfo.port,
						database : dbInfo.database,
						timezone : dbInfo.timezone
					});

					connection.query("SET NAMES UTF8;", function(error, results, fields){
						if(error){
							throw error;
						}
					});
					
					for(let i = 0; i < tableInfo.length; i++){
						await new Promise((resolve, reject) => {
							connection.query(tableInfo[i].join(""), function(error, results, fields){
								if(error){
									console.error(error);
									return;
								}
								resolve();
							});
						});
					}
					console.log("SUCCESS: create database successfully!");
					resolve();
					return;
				});
			}).catch((error)=>{
				console.error(error);
			});
		}
		catch(err){
            console.error("ERROR: " + err);
            return;
        }
    },
	
    dataBaseControl: function(sql, args, callback){
        if(args == null){
            connection.query(sql, function(error, results, fields){
                if(error){
                    console.error(error);
                    callback(null);
                    return;
                }
                callback(results);
            });
        }
        else{
            connection.query(sql, args, function(error, results, fields){
                if(error){
                    console.error(error);
                    callback(null);
                    return;
                }
                callback(results);
            });
        }
    }
};

database.tableInit();
handleDisconnect(connection);
module.exports = database;
