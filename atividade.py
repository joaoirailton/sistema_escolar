import pyautogui as a
import time

a.FAILSAFE = True
a.PAUSE = 0.5

time.sleep(4)

for i in range(7):#quantidade de turmas
    a.click(579, 413)#clica para selecionar a turma
    a.press('down')
    a.press('enter')
    time.sleep(5)
    a.hotkey('command', 'down')
    
    total=323
    for d in range(8):#quantidade de disciplinas
        a.rightClick(1286, total)
        a.press('down')
        a.press('enter')
        total=total+66


    a.hotkey('command', 'up')



#    a.click(573, 191)#CLICA NO CAMPO DE EDIÇÃO DE TEXTO
#    a.keyDown('shift')
#    a.keyDown('space')
#    a.press('up')
#    a.keyUp('space')
#    a.keyUp('shift')
#    a.hotkey('command', 'c')
#    a.press('right', presses=4)
#    a.click(573, 191)#CLICA NO CAMPO DE EDIÇÃO DE TEXTO
#    a.keyDown('command')
#    a.press('up')
#    a.hotkey('command', 'v')
#    a.press('enter')
#    a.press('left', presses=4)
#    a.press('enter')