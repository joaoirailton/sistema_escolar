import pyautogui as pa
import time

pa.FAILSAFE = True
#pa.PAUSE = 1

time.sleep(4)
for i in range(1):
    pa.click(573, 191)#CLICA NO CAMPO DE EDIÇÃO DE TEXTO
    pa.keyDown('shift')
    pa.keyDown('space')
    pa.press('up')
    pa.keyUp('space')
    pa.keyUp('shift')
    pa.hotkey('command', 'c')
    pa.press('right', presses=4)
    pa.click(573, 191)#CLICA NO CAMPO DE EDIÇÃO DE TEXTO
    pa.keyDown('command')
    pa.press('up')
    pa.hotkey('command', 'v')
    pa.press('enter')
    pa.press('left', presses=4)
    pa.press('enter')