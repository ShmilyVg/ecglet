import Protocol from "../apis/network/protocol";
import Storage from "./storage";

export class RandomRemindData {
    constructor() {
        this.tempRemindDataList = [];
        this.currentIndex = 0;
        this.remindData = [
            {content: '将双手放到金属片上测试，过程中勿交谈、移动，保持静息状态',},
            {content: 'P波由心房除极所产生，是每一波中的第一波，前半部分代表右房，后半部分代表左房。故P波异常代表心房问题。',},
            {content: 'QRS波群是心电图心室除极的时间，是心室活动的表现，故QRS异常常见心室问题。',},
            {content: '心房出问题不会马上出人命，但心室会！',},
            {content: '一份心电图若连异常的QRS波都找不到，说明心跳已经停止了哦',},
            {content: '心率是指正常人安静状态下每分钟心跳的次数，它反映的是心脏跳动快慢程度；',},
            {content: '心律就是指心跳的节奏。它反映的是心脏跳动间隔（节奏）是否相同、均匀，即齐还是不齐。',},
            {content: '心房与心室之间有瓣膜（房室瓣），瓣膜使血液只能由心房流入心室，而不能倒流；',},
            {content: '心悸症状是否属于异常，取决于：有无诱因、是突然发生或 是逐渐发生、心跳频率、是否有心律不齐及其严重程度等。',},
            {content: '心悸与其他症状如气促、胸痛、乏力和倦怠、眩晕等一道出现时常提示有心律失常或其他严重疾病存在。',},
            {content: '气促是心力衰竭的常见症状之一，是液体渗出到肺脏中肺泡间质的结果，被称为肺充血或肺水肿，类似于溺水。',},
            {content: '常说的心绞痛就是由于心肌不能获得足够的血液供应而产生的一种胸部紧缩感或压榨感。'},
            {content: '看看你心电图上的P波，是不是高尖呢？那可能代表你的心房肥大哦！'},
            {content: '烧菜加点蒜，能阻止红细胞聚集，防止动脉栓塞；减少动脉损伤；阻止胆固醇堆积，防止动脉硬化'},
            {content: '正常心电图中，每一段心电最高的点就是R点，左右两格向下的点间即为一个QRS间期；'},
            {content: '心电图上有很~~长一段无P波时，那可能是造成了停搏现象。'},
            {content: '如果P-P（R-R）间期都是一致的，则代表心房（心室）节律是规则的。'},
            {content: '如何评估心房至心室间的传导速度呢？分析PR间期哇^0^！3~5小格算是正常哦！'},
            {content: '当你的平均心率小于60bpm，说明您窦性心动过缓；但是也和年龄性别有关，有些运动员心率也很低'},
            {content: '喝酒不利于心脏健康，但是葡萄酒是个好东西，身体条件允许的话可以小酌一杯。'},
            {content: '救救你的心脏！不要熬夜啦！'},
            {content: '心电图上有很~~长一段无P波时，那可能是造成了停搏现象。'},
            {content: '多听他人建议。多与他人相处，会感觉更快乐'},
            {content: 'QRS波群反映左、右心室除极电位和时间的变化，第一个向下的波为Q波，向上的波为R波，接着向下的波是S波。'},
            {content: '除极：大量阳离子短时间内涌入心肌细胞膜内，使膜内电位由-变+'},
            {content: '复极：由心外膜向心内膜，细胞膜又排出大量阳离子，使膜内电位由正变负，称为复极'},
            {content: '心动过速可以降低心脏的泵送能力，导致呼吸短促，胸痛，头晕或意识丧失。如果严重，它也可能导致心脏病发作或死亡。'},
            {content: '减脂也有利于心脏健康哦！'},
            {content: '吃饭不要吃太饱，也是对心脏的一种保护呢'},
            {content: '要多运动强健体魄，但注意运动太剧烈也不好'},
            {content: '饭后下楼遛遛弯儿，呼吸呼吸新鲜空气'},
            {content: '二手烟的危害有目共睹，为了您的心脏也要避免吸二手烟呢'},
            {content: '不要以为巧克力不太好，如果是高血压的患者吃点黑巧克力也是不错的选择'},
            {content: '中医讲“喜伤心”，并不是代表不让人开心，开心是必要的，但是要有度'},
            {content: '多吃蔬菜，多喝水，少盐！少盐！少盐！'},
            {content: '土豆南瓜西红柿，香菇玉米大豆角~吃起来~'},
            {content: '每一年的9月29日是“世界心脏日”，保护心脏，关爱身体健康。'},
            {content: '保护自己的心脏，从了解自己的心电图开始'},
            {content: '人的一生中每多锻炼一个小时，将会使寿命增加两个小时'},
            {content: '大量的动物研究显示，鱼肉中的蛋白质亦对心血管健康具有重要的作用'},
            {content: '适时排解压力，学会倾诉'},
            {content: '熬夜使人变老，也会使心脏承受它本不应该承受的压力'},
            {content: '不抽烟不喝酒，是为了自己也是为了子女'},
            // {content: ''},
        ];
        if (Storage.isUpdateLocalStorage()) {
            Protocol.getCopywritingChecking().then(data => {
                Storage.setTips({tips: (this.remindData = data.result.contents)});
            });
        } else {
            this.remindData = Storage.getTipsSync();
        }
    }

    random() {
        const array = [...this.remindData], len = array.length;
        this.currentIndex = 0;
        this.tempRemindDataList.splice(0, this.tempRemindDataList.length);
        for (let i = 0; i < len; i++) {
            let index = Math.floor(Math.random() * (array.length - 1));
            this.tempRemindDataList.push(...array.splice(index, 1));
        }
    }

    getRemindData() {
        return this.tempRemindDataList[this.currentIndex >= this.tempRemindDataList.length ? (this.currentIndex = 0) : this.currentIndex++].content;
    }
}
