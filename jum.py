import random
import time

def random_color():
    colors = ["'가거라'", "'가지 말거라'"]
    return random.choice(colors)

# 함수를 호출하여 무작위 색상을 얻을 수 있습니다.
color = random_color()
print("이제 곧 점괘가 나옵니다 ...")
time.sleep(2)
print("호이짜")
time.sleep(2)
print("신령의 말씀을 보겠습니다")
time.sleep(2)
print("결과:", color)