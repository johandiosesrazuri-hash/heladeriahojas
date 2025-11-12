$lines = netstat -aon | Select-String ':5173'
if ($lines) {
    foreach ($l in $lines) {
        $cols = $l -split '\s+'
        $pid = $cols[-1]
        try {
            Stop-Process -Id ([int]$pid) -Force -ErrorAction Stop
            Write-Output ("Stopped Vite process PID {0}" -f $pid)
        } catch {
            Write-Output ("Failed to stop PID {0}: {1}" -f $pid, $_)
        }
    }
} else {
    Write-Output 'No process listening on :5173'
}

Start-Sleep -Seconds 1

# Ensure backend is running on 8080; if not, start the jar in background
$backendListening = (netstat -aon | Select-String ':8080') -ne $null
if (-not $backendListening) {
    $jarPath = 'c:\Users\JOHAN\Documents\heladeriahojas\heladeriahojas\backend\target\chocco-delight-backend-0.0.1-SNAPSHOT.jar'
    if (Test-Path $jarPath) {
        Write-Output "Starting backend jar: $jarPath"
        Start-Process -FilePath 'java' -ArgumentList "-jar","$jarPath" -WindowStyle Hidden | Out-Null
        Start-Sleep -Seconds 3
        Write-Output 'Backend started (detached).'
    } else {
        Write-Output "Backend jar not found at $jarPath. Start the backend manually and re-run this script."
    }
} else {
    Write-Output 'Backend already listening on :8080'
}

$regBody = @'
{"nombre":"TestUser","email":"testuser@example.com","password":"Test1234"}
'@
try {
    $reg = Invoke-RestMethod -Method Post -Uri 'http://localhost:8080/api/auth/register' -ContentType 'application/json' -Body $regBody -ErrorAction Stop
    Write-Output '--- REGISTER RESPONSE ---'
    $reg | ConvertTo-Json -Depth 5
} catch {
    Write-Output 'REGISTER FAILED:'
    if ($_.Exception -and $_.Exception.Response) {
        $text = $_.Exception.Response.Content.ReadAsStringAsync().Result
        Write-Output $text
    } else { Write-Output $_ }
}

$loginBody = @'
{"email":"testuser@example.com","password":"Test1234"}
'@
try {
    $login = Invoke-RestMethod -Method Post -Uri 'http://localhost:8080/api/auth/login' -ContentType 'application/json' -Body $loginBody -ErrorAction Stop
    Write-Output '--- LOGIN RESPONSE ---'
    $login | ConvertTo-Json -Depth 5
    if ($login -is [System.Collections.IDictionary]) {
        if ($login.ContainsKey('token')) { $t = $login['token'] }
        elseif ($login.ContainsKey('accessToken')) { $t = $login['accessToken'] }
        else { $t = $login | ConvertTo-Json -Depth 1 }
        Write-Output '--- TOKEN ---'
        Write-Output $t
    } else {
        Write-Output 'Login returned non-dictionary response'
        $login
    }
} catch {
    Write-Output 'LOGIN FAILED:'
    if ($_.Exception -and $_.Exception.Response) {
        $text = $_.Exception.Response.Content.ReadAsStringAsync().Result
        Write-Output $text
    } else { Write-Output $_ }
}
