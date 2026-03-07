import pyautogui as pa
import time

pa.FAILSAFE = True
pa.PAUSE = 1

"""
pa.keyDown('command')
pa.press('space')
pa.keyUp('command')
pa.write("google chrome")
pa.press('enter')
pa.write("PROESC.com")
pa.press('enter')
time.sleep(5)
pa.press('tab', presses=6)
pa.press('enter')
time.sleep(7)
pa.hotkey('ctrl', 'command', 'f')
pa.click(100, 469)
pa.click(95, 541)
pa.click(112,571)
time.sleep(4)
"""
time.sleep(2)
lu=457
for i in range(5):
    pa.click(283,475)
    time.sleep(2)
    pa.click(553,455)
    pa.click(1321,lu)
    pa.click(932,454)
    time.sleep(4)
    pa.hotkey('command', 'p')
    pa.press('tab', presses=4)#SELECIONA O CAMPO DAS IMPRESSORAS
    pa.write("sa")
    pa.click(1175,737)
    pa.write("aluno" + str(lu))
    pa.click(1172,735)
    time.sleep(3)
    pa.click(402,463)
    pa.click(1073,751)
    pa.click(770,57)
    pa.click(1014,211)

    lu += 43
