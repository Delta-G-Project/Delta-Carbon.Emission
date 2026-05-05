$srcDir = "C:\Users\abood\Downloads\New Front\temp_extract\Delta Carbon Emission\src"
$utf8NoBom = New-Object System.Text.UTF8Encoding $False

# 1. Move and rename components
$compDir = "$srcDir\app\components\_component"
$destCompDir = "$srcDir\components"
if (Test-Path $compDir) {
    if (Test-Path "$compDir\AIInsights .jsx") { Move-Item "$compDir\AIInsights .jsx" "$destCompDir\AIInsights.jsx" -Force }
    if (Test-Path "$compDir\Header.jsx") { Move-Item "$compDir\Header.jsx" "$destCompDir\LandingHeader.jsx" -Force }
    Get-ChildItem $compDir | Move-Item -Destination $destCompDir -Force
    Remove-Item $srcDir\app\components -Recurse -Force
}

# 2. Process all JS/JSX files
Get-ChildItem -Path $srcDir -Recurse -Include *.js,*.jsx | ForEach-Object {
    $content = [IO.File]::ReadAllText($_.FullName, $utf8NoBom)
    $original = $content
    
    # Update imports
    $content = $content -replace "(['""])[^'""]*components/_component/Header(['""])", "`$1@/components/LandingHeader`$2"
    $content = $content -replace "(['""])[^'""]*components/_component/AIInsights (['""])", "`$1@/components/AIInsights`$2"
    $content = $content -replace "(['""])[^'""]*components/_component/([^'""]+)(['""])", "`$1@/components/`$2`$3"
    $content = $content -replace "(['""])(?:\.\./)+contexts/LanguageContext(['""])", "`$1@/contexts/LanguageContext`$2"
    $content = $content -replace "(['""])(?:\.\./)+Translations(['""])", "`$1@/Translations`$2"
    
    # Comment console.log
    $content = $content -replace '(?<!//\s*)console\.log\(', '// console.log('
    
    # Fix company-profile catch blocks
    if ($_.Name -eq "page.js" -and $_.FullName -match "company-profile") {
        $content = $content -replace '\} catch \(e\) \{ // console\.log\("Demo Mode: Using Mock Data"\); \}', "} catch (e) { // console.log(`"Demo Mode: Using Mock Data`"); `n    }"
        $content = $content -replace '\} catch \(e\) \{ // console\.log\("Backend not ready"\); \}', "} catch (e) { // console.log(`"Backend not ready`"); `n    }"
    }

    if ($content -cne $original) {
        [IO.File]::WriteAllText($_.FullName, $content, $utf8NoBom)
    }
}
