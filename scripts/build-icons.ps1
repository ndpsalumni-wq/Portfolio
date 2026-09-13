$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing
$projectRoot = Split-Path $PSScriptRoot -Parent
$outputs = @{
    'favicon-16x16.png' = 16
    'favicon-32x32.png' = 32
    'favicon-48x48.png' = 48
    'favicon-96x96.png' = 96
    'apple-touch-icon.png' = 180
    'images/logo-192x192.png' = 192
    'images/logo-512x512.png' = 512
    'images/favicon.png' = 96
}
foreach ($entry in $outputs.GetEnumerator()) {
    $size = $entry.Value
    $bitmap = New-Object System.Drawing.Bitmap($size, $size)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    $graphics.Clear([System.Drawing.ColorTranslator]::FromHtml('#202b29'))
    $graphics.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
    $font = New-Object System.Drawing.Font('Arial', ($size * 0.54), ([System.Drawing.FontStyle]::Bold), ([System.Drawing.GraphicsUnit]::Pixel))
    $brush = New-Object System.Drawing.SolidBrush([System.Drawing.ColorTranslator]::FromHtml('#f7f7f2'))
    $format = New-Object System.Drawing.StringFormat
    $format.Alignment = [System.Drawing.StringAlignment]::Center
    $format.LineAlignment = [System.Drawing.StringAlignment]::Center
    $rect = New-Object System.Drawing.RectangleF(0, (-0.025 * $size), $size, $size)
    $graphics.DrawString('ab', $font, $brush, $rect, $format)
    $bitmap.Save((Join-Path $projectRoot $entry.Key), [System.Drawing.Imaging.ImageFormat]::Png)
    $format.Dispose(); $brush.Dispose(); $font.Dispose(); $graphics.Dispose(); $bitmap.Dispose()
}
# Store the new 48px PNG in a standards-compliant single-image ICO container.
$png = [System.IO.File]::ReadAllBytes((Join-Path $projectRoot 'favicon-48x48.png'))
$stream = [System.IO.File]::Create((Join-Path $projectRoot 'favicon.ico'))
$writer = New-Object System.IO.BinaryWriter($stream)
$writer.Write([uint16]0); $writer.Write([uint16]1); $writer.Write([uint16]1)
$writer.Write([byte]48); $writer.Write([byte]48); $writer.Write([byte]0); $writer.Write([byte]0)
$writer.Write([uint16]1); $writer.Write([uint16]32); $writer.Write([uint32]$png.Length); $writer.Write([uint32]22)
$writer.Write($png); $writer.Dispose(); $stream.Dispose()
