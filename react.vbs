Set WshShell = CreateObject("WScript.Shell" ) 
WshShell.Run chr(34) & "D:\Node\start.bat" & Chr(34), 0 
Set WshShell = CreateObject("WScript.Shell" ) 
WshShell.Run "CMD /k start http://127.0.0.1:4000" & Chr(34), 0 
Set WshShell = Nothing 