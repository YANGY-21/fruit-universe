import type { FruitKey } from './fruits';

export interface QuestionOption {
  l: string;
  s: Partial<Record<FruitKey, number>>;
}

export interface Question {
  q: string;
  o: QuestionOption[];
}

export const ALL_QS: Question[] = [
  {
    q: '如果你的大脑是手机后台，还剩多少内存？',
    o: [
      { l: '20%——别开新app了', s: { strawberry: 2, blueberry: 1 } },
      { l: '80%——几乎没怎么用过', s: { apple: 2, watermelon: 1 } },
      { l: '50%——能用但不流畅', s: { banana: 2, peach: 1 } },
      { l: '20个同时跑不卡', s: { orange: 2, mango: 1 } },
    ],
  },
  {
    q: '朋友发来60秒语音你的反应？',
    o: [
      { l: '转文字看个大概', s: { apple: 2, lemon: 1 } },
      { l: '直接听万一是大事', s: { peach: 2, orange: 1 } },
      { l: '放着等有准备了再听', s: { kiwi: 2, blueberry: 1 } },
      { l: '已读不回等ta说重点——别给我发语音', s: { watermelon: 1, durian: 2 } },
    ],
  },
  {
    q: '你比较像哪种植物？',
    o: [
      { l: '温室植物——需要稳定环境', s: { strawberry: 2, cherry: 1 } },
      { l: '路边野草——踩了也能长', s: { apple: 2, banana: 1 } },
      { l: '多肉——不用管也能活', s: { avocado: 2, watermelon: 1 } },
      { l: '牵牛花——得找个东西靠着', s: { orange: 2, peach: 1 } },
    ],
  },
  {
    q: '你的周末通常是什么形态？',
    o: [
      { l: '正常人类——出门干了事', s: { orange: 2, mango: 1 } },
      { l: '待机——在外面但不想说话', s: { kiwi: 2, pineapple: 1 } },
      { l: '地缚灵——半径不超三米', s: { avocado: 2, blueberry: 1 } },
      { l: '普通模式——该干嘛干嘛', s: { apple: 2, banana: 1 } },
    ],
  },
  {
    q: '你在人群中的角色类似？',
    o: [
      { l: '气氛组——不让话掉地上', s: { orange: 2, banana: 1 } },
      { l: '观察员——话少但门清', s: { lemon: 2, blueberry: 1 } },
      { l: '稳定器——有你在大家安心', s: { apple: 2, peach: 1 } },
      { l: '变数——没人知道你下一句是什么', s: { mango: 1, durian: 2 } },
    ],
  },
  {
    q: '你最常听到的评价是？',
    o: [
      { l: '"你人还怪好的"', s: { peach: 2, apple: 1 } },
      { l: '"你好好笑"', s: { orange: 2, banana: 1 } },
      { l: '"你好安静"', s: { kiwi: 2, blueberry: 1 } },
      { l: '"你好敢"或"你真的很直接"', s: { lemon: 1, durian: 2 } },
    ],
  },
  {
    q: '如果人生是游戏你目前在哪？',
    o: [
      { l: '捏脸界面——还没开始', s: { avocado: 2, strawberry: 1 } },
      { l: '新手村——做了三百遍任务还没出去', s: { banana: 2, watermelon: 1 } },
      { l: '任务全满——不知先做哪个', s: { orange: 2, mango: 1 } },
      { l: '隐藏关卡——走出了自己的路', s: { cherry: 1, durian: 2 } },
    ],
  },
  {
    q: '选一句你最认同的',
    o: [
      { l: '差不多就行了', s: { banana: 2, avocado: 1 } },
      { l: '要么不做要么做好', s: { cherry: 2, lemon: 1 } },
      { l: '做人留一线', s: { peach: 2, apple: 1 } },
      { l: '关我屁事+关你屁事', s: { watermelon: 2, durian: 1 } },
    ],
  },
  {
    q: '你手机相册里最多的是什么？',
    o: [
      { l: '截图——有用的没的先截了再说', s: { apple: 2, blueberry: 1 } },
      { l: '自拍/合照——留存生活记录', s: { orange: 2, strawberry: 1 } },
      { l: '风景/食物——构图比实物好看', s: { strawberry: 2, mango: 1 } },
      { l: '乱七八糟什么都有懒得删', s: { banana: 2, watermelon: 1 } },
    ],
  },
  {
    q: '突然多了一笔闲钱你第一反应是？',
    o: [
      { l: '存起来——万一以后有用', s: { apple: 2, peach: 1 } },
      { l: '请朋友吃饭或者出去玩', s: { orange: 2, banana: 1 } },
      { l: '买个想了很久的东西', s: { cherry: 2, mango: 1 } },
      { l: '先放着——还没想好买什么', s: { avocado: 2, watermelon: 1 } },
    ],
  },
  {
    q: '你在群里（家庭群/朋友群）一般是？',
    o: [
      { l: '潜水——偶尔冒个泡', s: { kiwi: 2, blueberry: 1 } },
      { l: '话最多的那一个', s: { orange: 2, banana: 1 } },
      { l: '只回跟自己有关的话题——其他无视', s: { lemon: 1, durian: 2 } },
      { l: '负责打圆场不让话掉地上', s: { peach: 2, apple: 1 } },
    ],
  },
  {
    q: '哪种社交场景让你最想逃？',
    o: [
      { l: '团建——尤其要玩游戏的那种', s: { avocado: 2, blueberry: 1 } },
      { l: '路上遇到半生不熟的人要寒暄', s: { kiwi: 2, watermelon: 1 } },
      { l: '突然被点名发言——没有准备', s: { strawberry: 2, peach: 1 } },
      { l: '多人聚餐轮流敬酒', s: { pineapple: 2, lemon: 1 } },
    ],
  },
  {
    q: '你觉得自己更像哪种动物？',
    o: [
      { l: '猫——独立看心情', s: { mango: 2, blueberry: 1 } },
      { l: '狗——热情爱凑热闹', s: { orange: 2, peach: 1 } },
      { l: '树懒——能不动就不动', s: { avocado: 2, banana: 1 } },
      { l: '狮子——有自己的领地不容侵犯', s: { durian: 2, pineapple: 1 } },
    ],
  },
  {
    q: '你对做计划这件事的态度是？',
    o: [
      { l: '不做——计划赶不上变化', s: { banana: 2, watermelon: 1 } },
      { l: '大概有个方向就行', s: { orange: 2, mango: 1 } },
      { l: '详细计划严格执行', s: { cherry: 2, apple: 1 } },
      { l: '做了但不一定照做', s: { strawberry: 2, avocado: 1 } },
    ],
  },
  {
    q: 'KTV里你一般是哪种角色？',
    o: [
      { l: '麦霸——抢不到话筒会急', s: { orange: 2, mango: 1 } },
      { l: '角落玩手机——等结束', s: { kiwi: 2, blueberry: 1 } },
      { l: '偶尔点一首继续沉默', s: { peach: 2, lemon: 1 } },
      { l: '不唱——我唱歌只给想听的人听', s: { durian: 2, banana: 1 } },
    ],
  },
  {
    q: '你收到微信消息一般多久回？',
    o: [
      { l: '看到就回——不管是谁', s: { peach: 2, orange: 1 } },
      { l: '看人——有的秒回有的隔天', s: { strawberry: 2, mango: 1 } },
      { l: '想好怎么回了再回', s: { kiwi: 2, blueberry: 1 } },
      { l: '想回就回不想回就不回', s: { durian: 2, banana: 1 } },
    ],
  },
  {
    q: '你吃东西的习惯更接近哪种？',
    o: [
      { l: '好吃的留到最后吃', s: { peach: 2, strawberry: 1 } },
      { l: '先把好吃的吃了再说', s: { orange: 2, banana: 1 } },
      { l: '随便——吃到哪算哪', s: { avocado: 2, watermelon: 1 } },
      { l: '一口饭一口菜搭配着来', s: { apple: 2, cherry: 1 } },
    ],
  },
  {
    q: '临睡前你一般是什么状态？',
    o: [
      { l: '刷手机刷到眼皮打架才睡', s: { banana: 2, strawberry: 1 } },
      { l: '过一遍明天要做的事', s: { apple: 2, cherry: 1 } },
      { l: '复盘今天说错的话做错的事', s: { strawberry: 2, blueberry: 1 } },
      { l: '沾枕头就着——从不失眠', s: { watermelon: 2, avocado: 1 } },
    ],
  },
];
