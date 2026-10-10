import pyautogui as a
import pyperclip as c
import time

a.FAILSAFE = True
a.PAUSE = 0.5

time.sleep(4)

pos=125

for i in range(2):#quantidade de abas
    a.click(pos, 59)
    a.press('down', presses=6)
    a.dragTo(470, 669, duration=1, button='left')
    a.hotkey('command', 'c')
    prof=c.paste()