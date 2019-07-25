let obj = {
    "code": 1,
    "msg": null,
    "result": {
        "pdfUrl": "http://localhost:8091/hipee-web-hiecg/pdf/3a20c0e7e5534d81ae3b7e805b399494.jpg",
        "report": [{
            "createdTimestamp": 1563441828843,
            "updatedTimestamp": null,
            "id": 27,
            "indicatorId": 33,
            "type": 1,
            "target": 1,
            "time": "60",
            "typeDes": "常规心电检测",
            "unit": "bpm",
            "introduction": "心率",
            "targetDes": "HR",
            "des": "正常",
            "conclusion": null,
            "status": "1",
            "color": "#EF3A59"
        }, {
            "createdTimestamp": 1563441828845,
            "updatedTimestamp": null,
            "id": 28,
            "indicatorId": 33,
            "type": 1,
            "target": 2,
            "time": "50",
            "typeDes": "常规心电检测",
            "unit": "ms",
            "introduction": "QTC",
            "targetDes": "QTC",
            "des": "正常",
            "conclusion": null,
            "status": "1",
            "color": "#EF3A59"
        }, {
            "createdTimestamp": 1563441828847,
            "updatedTimestamp": null,
            "id": 29,
            "indicatorId": 33,
            "type": 1,
            "target": 3,
            "time": "79",
            "typeDes": "常规心电检测",
            "unit": "ms",
            "introduction": "QRS",
            "targetDes": "QRS",
            "des": "正常",
            "conclusion": null,
            "status": "1",
            "color": "#EF3A59"
        }],
        "time": 1563441828652,
        "type": 1,
        "title": "心律失常(也可能是由于信号干扰导致误判)"
    }
};

let obj2 = {
    "code": 1,
    "msg": null,
    "result": {
        "stress": {"score": "100", "title": null, "content": ["压力比较大，注意休息"]},
        "emotion": null,
        "tired": null,
        "list": [
            {
                "unit": "bpm",
                "des": "异常",
                "color": "#EF3A59",
                "name": "心率",
                "frequency": "52"
            },
            {
                "conclusion": null,
                "des": "正常",
                "color": "#EF3A59",
                "name": "SDNN"
            }
        ]
    }
};
