# Orcanos TortoiseSVN Integration
Orcanos (QPack) and SVN (Sub Version) hook script integration, based on Orcanos REST web services

###Instructions
Download post-commit.js to your local drice

###TortoiseSVN Settings
Call post-commit javascript in SVN hook script (TortoiseSVN->Settings->Hook Scripts)
- <b>Hook Type: </b>Post Post-Commit-Hook
- <b>Working Copy Path: </b>The SVN location under which you want this hook to be executed
- <b>Command Line to Execute: </b>wscript "[javascript file location]/post-commit.js"

###Javascript Settings
Setup your js file as follows:

UserPassword - QPack user name

UserName - QPack password

apiUrl - your web service URL. 
- Format for old Orcanos cloud is https://cloud.orcanos.com/[ACCOUNT_NAME]/qpackserv/qpackserv.asmx/QW_Add_Source_File
- Format for new Orcanos cloud is https://alm.orcanos.com/[ACCOUNT_NAME]/qpackserv/qpackserv.asmx/QW_Add_Source_File
- Local Installation - http://[YOUR_SERVER]/qpack/qpackserv/qpackserv.asmx/QW_Add_Source_File

logFile - path for local log file (path must exist)

###Commit Changes 
On commit, you need to put the defect ID as follows: "This is a test comment for {Defect-1067} Fix"

QPack web service will parse the comment and add the link to the source file in QPack databsae, where defect key becomes hyperlink

###Orcanos Settings
In QPack, you need to setup SVN user with QPack user, and SVN path with QPack project and version

