from time import time, strftime, localtime, sleep
from environs import Env
from bs4 import BeautifulSoup
from config import keywords
from apscheduler.schedulers.blocking import BlockingScheduler
import requests
import re
import random
import json

env = Env()
env.read_env()

group_url = 'https://www.douban.com/group/'

API_ADD = 'https://db-api.dongxin.co/v1/topic'
API_PUSH = 'https://push.dongxin.co/v1/message/send'

headers = {
    "user-agent":
    "Mozilla / 5.0(Windows NT 10.0; Win64; x64) AppleWebKit / 537.36(KHTML, like Gecko) Chrome / 70.0.3538.77 Safari / 537.36",
    'referer': 'https://www.douban.com/'
}


def getCookie():
    COOKIE = env('COOKIE')
    COOKIE_TIME = env('COOKIE_TIME')
    cookie = COOKIE.replace(COOKIE_TIME, str(int(time())))
    cookies = dict()
    for key in cookie.split(';'):
        keyValue = key.split('=')
        cookies[keyValue[0].strip()] = keyValue[1]
    return cookies


def task():
    response = requests.get(group_url, cookies=getCookie(), headers=headers)
    parserHtml(response.content)


def parserHtml(html):
    list = []
    soup = BeautifulSoup(html, 'html.parser')
    restr = '|'.join(keywords)
    pattern = fr'\b{restr}\b'
    for tr in soup.select('.pl'):
        title = tr.a['title']
        href = tr.a['href']
        time = tr.find(attrs={'class': 'td-time'}).string
        res = re.search(pattern, title, flags=0)
        if (time.find('今天') > -1 or time.find('前') > -1) and res:
            # if (time.find('昨天') > -1) and res:
            list.append(href)
    print(list)
    getTopic(list)


def getTopic(list):
    success = 0
    fail = 0
    for url in list:
        if url == 'https://www.douban.com/group/topic/278766995/':
            continue
        response = requests.get(url, cookies=getCookie(), headers=headers)
        soup = BeautifulSoup(response.content, 'html.parser')
        data = soup.select('script[type="application/ld+json"]')[0].get_text()
        data = json.loads("".join(data), strict=False)
        params = {
            'title': data['name'],
            'content': data['text'],
            'url': data['url'],
            'date': data['dateCreated'].replace('T', ' ')
        }
        res = requests.post(API_ADD, json=params)
        resJons = res.json()
        if resJons['code']:
            success += 1
        else:
            fail += 1
        sleep(random.randint(1, 3))
    params = {
        "token": env('PUSH_TOKEN'),
        "title": "豆瓣脚本提醒",
        "content":
        f'{strftime("%Y-%m-%d", localtime())} 新增 {len(list)} 条数据，成功{success}条，重复{fail}条',
        "template": "text"
    }
    res = requests.post(API_PUSH, json=params)
    print(res.json())


if __name__ == "__main__":
    task()
    scheduler = BlockingScheduler(timezone="Asia/Shanghai")
    scheduler.add_job(task, "cron", day_of_week="0-6", hour="23", minute=50)
    scheduler.start()