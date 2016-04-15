//////////////////////////////////////////////////
// Orcanos SVN Integration hook script
// Orcanos (C) All Rights Reserved
//////////////////////////////////////////////////

//QPack Credentials and web service URL
var UserPassword = 'password';
var UserName = 'user';
var apiUrl = 'put your API URL, such as https://cloud.orcanos.com/customer_name/qpackserv/qpackserv.asmx/QW_Add_Source_File';

//General settings
var debug = 0;	// Set to 0 for disable popup debug windows
var log = 1;	// Set to 0 for disable logging into the file
var commitStatus = 1;

//Log file - folder must exist on your folder
var logFile = "c:/qpack/scc/OrcanosSVNhook.log";

if (log)
{
	var fs = new ActiveXObject("Scripting.FileSystemObject");
	var logFs = fs.OpenTextFile(logFile, 8, true);
	logFs.WriteLine("Integration Started" + "\n--------------\n\n");
}

//Initialize
var objArgs,num;
objArgs = WScript.Arguments;
num = objArgs.length;

//Verify parameters from SVN
if (num != 6)
{     
	WScript.Echo("Usage: [CScript | WScript] Post-Commit.js path/to/pathsfile depth path/to/messagefile revision error path/to/CWD "); 
	if (log) {
		logFs.WriteLine("Missing parameters" + "\n--------------\n\n");
	}
	
	WScript.Quit(1);
} 
var i = 0;
var j = 0;

filesystem = new ActiveXObject("Scripting.FileSystemObject");
var paths = readPaths(objArgs(0));
revObject1 = new ActiveXObject("SubWCRev.object");
var comment = readPaths(objArgs(2));

var xmlDoc = new ActiveXObject("Microsoft.XMLDOM")
xmlDoc.async="false"

var text='<SccCheckin>'+'\n'

//Get SVN User name
while (j < 1 )
{
	revObject1.GetWCInfo(filesystem.GetAbsolutePathName(paths[j]), 1, 1);
	text = text + '<User>'+ revObject1.Author +'</User>'+'\n'
	j = j + 1;
}

text = text + '<ProjName>Empty</ProjName>'+'\n'
text = text + '<LocalEditPath>c:\</LocalEditPath>'+'\n'
text = text + '<RevisionNumber>'+objArgs(3)+'</RevisionNumber>'+'\n'
text = text + '<AuxProjPath>TestUser</AuxProjPath>'+'\n'
text = text + '<Comment>'+ comment+ '</Comment>'+'\n'
text = text + '<Changeset_Url>'+ '' + '</Changeset_Url>'+'\n'

//Add all committed files
while (i < paths.length)
{
	revObject1.GetWCInfo(filesystem.GetAbsolutePathName(paths[i]), 1, 1);
	Author = revObject1.Author;
	text = text + '<File name="' + revObject1.Url + '" Url="' + revObject1.Url + '?r=' + revObject1.Revision +  '" action="U" />' +'\n'
	i = i + 1;
}

text= text + '</SccCheckin>' 

//Create PSOT call
var xmlhttp = WScript.CreateObject("Microsoft.XMLHttp");
xmlhttp.open('POST', apiUrl , 0);
xmlhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

var post = "User_Name=" + UserName + "&User_Password=" + UserPassword + "&commit_status=" + commitStatus + "&scc_xml=" + encodeURIComponent(text);
if (debug) WScript.Echo(post);

if (log) {
	logFs.WriteLine("XML data\n" + text + "\n--------------\n\n");
	logFs.WriteLine("POST data\n" + post + "\n--------------\n\n");
}

xmlhttp.send(post);

if (debug) WScript.Echo("Response\n" + xmlhttp.responseText);
if (log) {
	logFs.WriteLine("Response\n" + xmlhttp.responseText + "\n--------------\n");
}
logFs.Close();

WScript.Quit(0);  

function readPaths(path)
{
	var retPaths = new Array();
	var fs = new ActiveXObject("Scripting.FileSystemObject");
	if (fs.FileExists(path))
	{
		var a = fs.OpenTextFile(path, 1, false);
		var i = 0;
		while (!a.AtEndOfStream)
		{
			var line = a.ReadLine();
			retPaths[i] = line;
			i = i + 1;
		}
		a.Close();
	}
	return retPaths;
}
