'use strict';

const PreAction = {
    STOP: 0x00,
    MOVE_FORWARD: 0x01,
    MOVE_BACKWARD: 0x02,
    TURN_LEFT: 0x03,
    TURN_RIGHT: 0x04,

    ACTION_UNKNOWN: 0xFF,
}

const req_info = []

class TelliotBase {
    constructor() {
        this.resetState();
    }

    async reqInfo(data, delayTime) {
        if (req_info.length !== 0) {

        }
        await this.delay(delayTime);
        req_info.push(data);
        console.log(req_info);
    }



    setZero() {
        this.resetState();
        Entry.hw.update();
    }

    afterReceive = function (data) {
        const keys = data.state ? Object.keys(data.state) : [];
        keys.forEach(key => {
            this.state[key] = data.state[key];
            // console.log(typeof (this.state.sensors));
        });

        // console.log('[afterReceive] : ' + keys);
        console.log('[afterReceive] : ', data.state);
    }

    afterSend = function () {
        this.resetState();
        Entry.hw.sendQueue = {};
    }

    resetState() {
        this.state = {
            sensors: 0,
            rfid: []
        };
    }

    async delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async request(func, subkey, value, updateNow = false) {
        const test = []

        if (!Entry.hw.sendQueue[func])
            Entry.hw.sendQueue[func] = {};

        if (subkey) {
            Entry.hw.sendQueue[func][subkey.toString()] = value;
        } else {
            Entry.hw.sendQueue[func] = value;
        }



        console.log('[' + func + '] : ' + value);

        if (updateNow)
            Entry.hw.update();

    }

    async req_add_chatbot(sprite, script) {
        const ask = script.getStringValue('AI_CHATBOT_ASK');
        const resp = script.getStringValue('AI_CHATBOT_RESP');

        console.log('[req_chatbot] : ' + ask + ' => ' + resp);
        await this.request('add_chatbot', null, { ask, resp }, true);
        return script.callReturn();
    }

    async req_voice_trigger(sprite, script) {
        await this.reqInfo('req_voice_trigger_click')
        await this.request('req_voice_trigger_click', null, 1);
        return script.callReturn();
    }

    async req_speech_to_text(sprite, script) {
        await this.request('req_stt', null, 1);
        return script.callReturn();
    }

    async req_text_to_speech(sprite, script) {
        // 스크립트에서 'TEXT_TO_SPEECH' 파라미터의 값을 가져옵니다.
        const stot = script.getStringValue('TEXT_TO_SPEECH');
        console.log(script);

        // 디버깅을 위한 텍스트 값 출력
        console.log('[req_tts] : ' + stot + stot.length);

        // 텍스트 길이에 따라 지연 시간 설정
        const textLength = stot.length;
        let delayTime;

        // 텍스트 길이에 따라 딜레이를 조정합니다.
        if (textLength <= 30) {
            delayTime = 5000;
        } else if (textLength <= 40) {
            delayTime = 6000;
        }else if (textLength <=50) {
            delayTime = 7000;
        } else {
            Entry.toast.warning('글자수 50자 제한으로 인한 동작불가', '현재 글자수 = ' + textLength,false)

            return; //글자수 초과로 인한 동작 정지
        }

        try {
            // TTS 명령을 하드웨어에 전송합니다.
            await this.request('req_tts', null, stot, true);

            // 딜레이 값과 함께 reqInfo 호출
            await this.reqInfo('req_tts', delayTime);

        } catch (error) {
            // 에러가 발생했을 경우 에러를 출력합니다.
            console.error('Error in req_text_to_speech:', error);
        }

        // 스크립트 실행 완료를 반환합니다.
        return script.callReturn();
    }



    async req_add_prompt(sprite, script) {
        const ai_prompt = script.getStringValue('AI_PROMPT');

        console.log('[add_prompt] : ' + ai_prompt);
        await this.request('add_prompt', null, ai_prompt, true);
        return script.callReturn();
    }

    async req_predefined_action(sprite, script) {
        const action_stridx = script.getStringValue('PREDEFINED_MOTION_ID');
        const action_value = script.getNumberValue('PREDEFINED_MOTION_VALUE');
        let action_id = PreAction.ACTION_UNKNOWN;

        switch (action_stridx) {
            case 'forward':
                action_id = PreAction.MOVE_FORWARD;
                break;
            case 'backward':
                action_id = PreAction.MOVE_BACKWARD;
                break;
            case 'left':
                action_id = PreAction.TURN_LEFT;
                break;
            case 'right':
                action_id = PreAction.TURN_RIGHT;
                break;
        }

        await this.request('pre_action', null, { action_id, action_value }, true);
        await this.delay(1250);
        return script.callReturn();
    }

    async req_action_stop(sprite, script) {
        const action_id = PreAction.STOP;
        const action_value = 0;

        await this.request('pre_action', null, { action_id, action_value }, true);
        return script.callReturn();
    }

    async req_motor_control(sprite, script) {
        const port = script.getStringValue('MOTOR_PORT_ID');
        const motor_value = script.getNumberValue('MOTOR_PORT_VALUE');
        const dir = script.getStringValue('MOTOR_DIRECTION');
        var motor_id, motor_dir;

        switch (port) {
            case 'left wheel': motor_id = 0; break;
            case 'right wheel': motor_id = 1; break;
            case 'left foot': motor_id = 0; break;
            case 'right foot': motor_id = 1; break;
            case 'left Leg': motor_id = 2; break;
            case 'right Leg': motor_id = 3; break;
            case 'left arm': motor_id = 4; break;
            case 'right arm': motor_id = 5; break;
            case 'head': motor_id = 6; break;
        }

        switch (dir) {
            case 'clockwise':
                motor_dir = 0;
                break;
            case 'counterclockwise':
                motor_dir = 1;
                break;
        }

        await this.request('motor_ctrl', null, { motor_id, motor_dir, motor_value }, true);
        return script.callReturn();
    }

    async req_line_trace(sprite, script) {
        const dir = script.getStringField('LINE_TRACE_DIR');
        var line_color = 0;
        var line_dir;

        switch (dir) {
            case 'forward':
                line_dir = 0;
                break;
            case 'backward':
                line_dir = 1;
                break;
        }

        await this.request('line_trace', null, { line_color, line_dir }, true);
        return script.callReturn();
    }

    req_detect_object(sprite, script) {
        const obj = script.getStringField('OBJECT_DETECT');
        var sensor_id = 0;
        var detect_object = 0;

        if (obj === 'detected')
            detect_object = 1;
        else
            detect_object = 0;
        console.log(this.state.sensors)
        console.log('[req_detect_object] : ' + this.state.sensors);
        if (detect_object === 1 && this.state.sensors !== 0 && typeof (this.state.sensors) === 'number') {
            console.log('1111111111111111')
            return true;
        } else if (detect_object === 0 && this.state.sensors.length === 0) {
            console.log('22222222222222222')
            return true;
        } else {
            console.log('123981237980123091238079231809')
            return false;
        }
    }

    req_rfid_tag_detect(sprite, script) {
        const tag = script.getStringField('TAG_DETECT');
        var tag_id = 0;

        switch (tag) {
            case 'circle': tag_id = 0; break;
            case 'rectangle': tag_id = 1; break;
            case 'triangle': tag_id = 2; break;
            case 'star': tag_id = 3; break;
            case 'diamond': tag_id = 4; break;
            case 'heart': tag_id = 5; break;
        }

        console.log('[req_rfid_tag_detect] : ' + tag_id + '   ' + this.state.rfid);
        if (this.state.rfid[tag_id]) {
            return true;
        } else {
            return false;
        }
    }

    async req_change_led_color(sprite, script) {
        const direction = script.getField('DIRECTION', script);
        const color = script.getStringValue('COLOR', script);

        // 색상을 RGB 값으로 변환
        const rgb = Entry.hex2rgb(color);

        // 변환된 RGB 값을 콘솔에 출력
        console.log(`Direction: ${direction}, Color: ${color}, RGB: (${rgb.r}, ${rgb.g}, ${rgb.b})`);

        // 하드웨어 명령을 보내는 부분
        let ledCommand;
        switch (direction) {
            case 'left':
                ledCommand = { left: { r: rgb.r, g: rgb.g, b: rgb.b } };
                break;
            case 'right':
                ledCommand = { right: { r: rgb.r, g: rgb.g, b: rgb.b } };
                break;
            case 'both':
                ledCommand = {
                    left: { r: rgb.r, g: rgb.g, b: rgb.b },
                    right: { r: rgb.r, g: rgb.g, b: rgb.b },
                };
                break;
        }

        // 전송할 명령을 콘솔에 출력
        console.log('LED Command:', ledCommand);

        // 실제 하드웨어로 명령을 전송
        await this.request('led_change', null, ledCommand, true);

        return script.callReturn();
    }

    async req_turn_off_led(sprite, script) {
        const direction = script.getField('DIRECTION', script);

        // RGB 값을 모두 0으로 설정하여 LED를 끕니다.
        const rgb = { r: 0, g: 0, b: 0 };

        // 전송할 명령을 콘솔에 출력
        console.log(`Direction: ${direction}, RGB: (${rgb.r}, ${rgb.g}, ${rgb.b})`);

        // 하드웨어 명령을 보내는 부분
        let ledCommand;
        switch (direction) {
            case 'left':
                ledCommand = { left: { r: rgb.r, g: rgb.g, b: rgb.b } };
                break;
            case 'right':
                ledCommand = { right: { r: rgb.r, g: rgb.g, b: rgb.b } };
                break;
            case 'both':
                ledCommand = {
                    left: { r: rgb.r, g: rgb.g, b: rgb.b },
                    right: { r: rgb.r, g: rgb.g, b: rgb.b },
                };
                break;
        }

        // 전송할 명령을 콘솔에 출력
        console.log('LED Command (Turn Off):', ledCommand);

        // 실제 하드웨어로 명령을 전송
        await this.request('led_change', null, ledCommand, true);

        return script.callReturn();
    }

    async req_change_led_rgb_color(sprite, script) {
        const direction = script.getValue('DIRECTION', script);
        let red = parseInt(script.getValue('RED', script), 10);
        let green = parseInt(script.getValue('GREEN', script), 10);
        let blue = parseInt(script.getValue('BLUE', script), 10);

        // 0~255 범위로 값 제한
        red = Math.max(0, Math.min(255, red));
        green = Math.max(0, Math.min(255, green));
        blue = Math.max(0, Math.min(255, blue));

        // 색상을 출력
        console.log(`Direction: ${direction}, RGB: (${red}, ${green}, ${blue})`);

        // 하드웨어 명령을 생성
        let ledCommand;
        switch (direction) {
            case 'left':
                ledCommand = { left: { r: red, g: green, b: blue } };
                break;
            case 'right':
                ledCommand = { right: { r: red, g: green, b: blue } };
                break;
            case 'both':
                ledCommand = {
                    left: { r: red, g: green, b: blue },
                    right: { r: red, g: green, b: blue },
                };
                break;
        }

        // 전송할 명령을 콘솔에 출력
        console.log('LED Command:', ledCommand);

        // 실제 하드웨어로 명령을 전송
        await this.request('led_change', null, ledCommand, true);

        return script.callReturn();
    }

    req_cds_value(sprite, script) {
        var sensor_value = this.state.cds_sensor_value || 0;  // CDS 센서 값
        console.log('[req_cds_value] : ' + sensor_value);
        return sensor_value;  // 센서 값을 반환
    }




}

module.exports = { TelliotBase, PreAction };


