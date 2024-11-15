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

class Block_NepesAICarBase {
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

	async request(func, subkey, value, updateNow = true) {
		const test = []

		if (!Entry.hw.sendQueue[func])
			Entry.hw.sendQueue[func] = {};

		if (subkey) {
			Entry.hw.sendQueue[func][subkey.toString()] = value;
		} else {
			Entry.hw.sendQueue[func] = value;
		}

		console.log('[' + func + '] : ' + JSON.stringify(value));

		if (updateNow)
			Entry.hw.update();
	}

	_compare(v1, v2, symbol) {
	    switch (symbol) {
			case 'EQUAL' :
				return v1 == v2;
			case 'GREATER' :
				return v1 > v2;
			case 'LESS' :
				return v1 < v2;
			case 'GREATER_OR_EQUAL' :
				return v1 >= v2;
			case 'LESS_OR_EQUAL' :
				return v1 <= v2;
            case 'greater-than':
                return v1 > v2;
            default:
				return false;
        }
	}

	req_read_sensor_value(sensorType) {
		this.request('sensor_read', null, {type: sensorType}, true);
	}

	async req_set_motor_speed(sprite, script) {
		const speed_value = parseInt(script.getValue('SPEED_VALUE', script), 10);

		if (speed < 0 || speed > 100) {
			Entry.toast.warning('�ӵ��� ������ 0 ~ 100');
			return;
		}

		let motor_cmd = { value: speed_value };

		await this.request('motor', 'speed', motor_cmd, true);

		return script.callReturn();
	}

	async req_nepes_car_move(sprite, script) {
		const action_value = script.getValue('MOVE_ACTION', script);

		let motor_cmd = action_value;
		await this.request('motor', 'action', motor_cmd, true);

		return script.callReturn();
	}

	async req_nepes_car_time_to_move(sprite, script) {
		const action_time = parseInt(script.getValue('MOVE_TIME', script), 10);
		const action_value = script.getValue('MOVE_ACTION', script);

		if (action_time < 0 || action_time > 600) {
			Entry.toast.warning('���� �ð��� 0 ~ 600�� �̳�');
			return;
		}

		let motor_cmd = { time:action_time, value:action_value };

		await this.request('motor', 'action_time', motor_cmd, true);

		return script.callReturn();
	}

	async req_nepes_car_each_move(sprite, script) {
		const left_direction = script.getValue('LEFT_MOVE_DIRECTION', script);
		const left_speed = parseInt(script.getValue('LEFT_MOVE_SPEED', script), 10);
		const right_direction = script.getValue('RIGHT_MOVE_DIRECTION', script);
		const right_speed = parseInt(script.getValue('RIGHT_MOVE_SPEED', script), 10);

		let motor_cmd = { left_dir:left_direction, left_sp: left_speed, right_dir: right_direction, right_sp:right_speed };
		await this.request('motor', 'control', motor_cmd, true);

		return script.callReturn();
	}

	async req_nepes_car_linetracing(sprite, script) {
		const action = script.getStringField('LINETRACEING_ACTION');
		let start_stop = 0;

		if (action == 'start')
			start_stop = 1;

		await this.request('line_trace', null, { cmd: start_stop }, true);

		return script.callReturn();
	}

	req_nepes_car_read_linetracing_value(sprite, script) {
		const direction = script.getStringField('LINETRACING_VALUE');
		this.req_read_sensor_value('reflective');

		if (direction == 'LEFT')
			return this.state.sensors.reflective.left_value;
		else
			return this.state.sensors.reflective.right_value;
	}

	req_nepes_car_read_linetracing_value_is(sprite, script) {
		const direction = script.getStringField('LINETRACING_DIRECTION');
		const color = script.getStringField('LINETRACING_VALUE');

		this.req_read_sensor_value('reflective');

		if (direction == 'LEFT') {
			if (color == 'BLACK')
				return this.state.sensors.reflective.left_value > 800;
			else
				return this.state.sensors.reflective.left_value <= 800;
		}
		else {
			if (color == 'BLACK')
				return this.state.sensors.reflective.right_value > 800;
			else
				return this.state.sensors.reflective.right_value <= 800;
		}
	}

	async req_nepes_car_set_led_control(sprite, script) {
		const direction = script.getField('LED_DIRECTION', script);
		const color = script.getStringValue('LED_COLOR_VALUE', script);

		// ������ RGB ������ ��ȯ
		const rgb = Entry.hex2rgb(color);

		// ��ȯ�� RGB ���� �ֿܼ� ���
		console.log(`Direction: ${direction}, Color: ${color}, RGB: (${rgb.r}, ${rgb.g}, ${rgb.b})`);

		req_led_ctrl(direction, rgb.r, rgb.g, rgb.b, 1);
		// �ϵ���� ������ ������ �κ�
		let ledCommand = { r: rgb.r, g: rgb.g, b: rgb.b, onoff: 1 };;
//		switch (direction) {
//			case 'left':
//				ledCommand = { left: { r: rgb.r, g: rgb.g, b: rgb.b, onoff: 1 } };
//				break;
//			case 'right':
//				ledCommand = { right: { r: rgb.r, g: rgb.g, b: rgb.b, onoff: 1 } };
//				break;
//			case 'both':
//				ledCommand = { both: { r: rgb.r, g: rgb.g, b: rgb.b, onoff: 1 } };
//				break;
//		}

		// ������ ������ �ֿܼ� ���
		console.log('LED Command:', ledCommand);

		// ���� �ϵ����� ������ ����
		await this.request('led_ctrl', direction, ledCommand, true);

		return script.callReturn();
	}

	async req_nepes_car_set_led_off(sprite, script) {
		const direction = script.getField('LED_DIRECTION', script);

		// RGB ���� ��� 0���� �����Ͽ� LED�� ���ϴ�.
		const rgb = { r: 0, g: 0, b: 0 };

		// ������ ������ �ֿܼ� ���
		console.log(`Direction: ${direction}, RGB: (${rgb.r}, ${rgb.g}, ${rgb.b})`);

		// �ϵ���� ������ ������ �κ�
		let ledCommand = { r: rgb.r, g: rgb.g, b: rgb.b, onoff: 0 } ;
//		switch (direction) {
//			case 'left':
//				ledCommand = { left: { r: rgb.r, g: rgb.g, b: rgb.b, onoff: 0 } };
//				break;
//			case 'right':
//				ledCommand = { right: { r: rgb.r, g: rgb.g, b: rgb.b, onoff: 0 } };
//				break;
//			case 'both':
//				ledCommand = { both: { r: rgb.r, g: rgb.g, b: rgb.b, onoff: 0 } };
//				break;
//		}

		// ������ ������ �ֿܼ� ���
		console.log('LED Command (Turn Off):', ledCommand);

		// ���� �ϵ����� ������ ����
		await this.request('led_ctrl', direction, ledCommand, true);

		return script.callReturn();
	}

	async req_nepes_car_set_led_detail_control(sprite, script) {
		const direction = script.getValue('LED_DIRECTION', script);
		let red = parseInt(script.getValue('LED_RED_VALUE', script), 10);
		let green = parseInt(script.getValue('LED_GREEN_VALUE', script), 10);
		let blue = parseInt(script.getValue('LED_BLUE_VALUE', script), 10);

		// 0~255 ������ �� ����
		red = Math.max(0, Math.min(255, red));
		green = Math.max(0, Math.min(255, green));
		blue = Math.max(0, Math.min(255, blue));

		// ������ ���
		console.log(`Direction: ${direction}, RGB: (${red}, ${green}, ${blue})`);

		// �ϵ���� ������ ����
		let ledCommand = { r: red, g: green, b: blue, onoff: 1 };
//		switch (direction) {
//			case 'left':
//				ledCommand = { left: { r: red, g: green, b: blue, onoff: 1 } };
//				break;
//			case 'right':
//				ledCommand = { right: { r: red, g: green, b: blue, onoff: 1 } };
//				break;
//			case 'both':
//				ledCommand = {
//					left: { r: red, g: green, b: blue, onoff: 1 },
//					right: { r: red, g: green, b: blue, onoff: 1 },
//				};
//				break;
//		}

		// ������ ������ �ֿܼ� ���
		console.log('LED Command:', ledCommand);

		// ���� �ϵ����� ������ ����
		await this.request('led_ctrl', direction, ledCommand, true);

		return script.callReturn();
	}

	req_nepes_car_sensor_read_light(sprite, script) {
		const direction = script.getValue('LIGHT_DIRECTION', script);

		this.req_read_sensor_value('light');

		if (direction == 'left')
			return this.state.sensors.light.left_value;
		else if (direction == 'right')
			return this.state.sensors.light.right_value;
		else
			return script.callReturn();
	}

	req_nepes_car_sensor_read_light_value_is(sprite, script) {
		const direction = script.getValue('LIGHT_DIRECTION', script);
		const symbol = script.getStringValue('LIGHT_VALUE_MEASURE');
        const value = script.getStringValue('LIGHT_VALUE');

		this.req_read_sensor_value('light');

		if (direction == 'left') {
			return this._compare(this.state.sensors.light.left_value, value, symbol);
		}
		else if (direction == 'right') {
			return this._compare(this.state.sensors.light.right_value, value, symbol);
		}
		else if (direction == 'both') {
			return (this._compare(this.state.sensors.light.left_value, value, symbol) & this._compare(this.state.sensors.light.right_value, value, symbol));
		}
		else
			return script.callReturn();
	}

	req_nepes_car_sensor_read_color_value(sprite, script) {
		const color_value = script.getValue('COLOR_VALUE', script);

		this.req_read_sensor_value('color');

		switch(color_value) {
			case 'RED' :
				if (this.state.sensors.color.red_value > 150 &&
					this.state.sensors.color.green_value < 70 &&
					this.state.sensors.color.blue_value < 60)
					return true;
				else
					return false;
            case 'YELLOW' :
				if (this.state.sensors.color.red_value < 70 &&
					this.state.sensors.color.green_value > 100 && this.state.sensors.color.green_value < 130 &&
					this.state.sensors.color.blue_value < 50)
					return true;
				else
					return false;
			case 'GREEN' :
				if (this.state.sensors.color.red_value < 50 &&
					this.state.sensors.color.green_value > 130 &&
					this.state.sensors.color.blue_value < 80)
					return true;
				else
					return false;
			case 'BLUE' :
				if (this.state.sensors.color.red_value < 40 &&
					this.state.sensors.color.green_value < 80 &&
					this.state.sensors.color.blue_value > 140)
					return true;
				else
					return false;
			case 'PURPLE' :
				if (this.state.sensors.color.red_value > 50 && this.state.sensors.color.red_value < 80 &&
					this.state.sensors.color.green_value < 90 &&
					this.state.sensors.color.blue_value > 90 && this.state.sensors.color.blue_value < 140)
					return true;
				else
					return false;
		}

		return false;
	}

	req_nepes_car_sensor_read_color_value_is(sprite, script) {
		// Need to check condition statements
		return script.callReturn();
	}

	req_nepes_car_sensor_read_color_RGB_value(sprite, script) {
		const color_rgb = script.getValue('COLOR_VALUE', script);

		this.req_read_sensor_value('color');

		if (color_rgb == 'RED')
			return this.state.sensors.color.red_value;
		else if (color_rgb == 'GREEN')
			return this.state.sensors.color.green_value;
		else if (color_rgb == 'BLUE')
			return this.state.sensors.color.blue_value;

		return script.callReturn();
	}

	req_nepes_car_sensor_read_distance(sprite, script) {
		const distance_unit = script.getValue('DISTANCE_VALUE', script);

		this.req_read_sensor_value('distance');

		if (distance_unit == 'CM')
			return (this.state.sensors.distance.value / 10);
		else
			return (this.state.sensors.distance.value);
	}

	req_nepes_car_sensor_object_detected(sprite, script) {
		return this.state.sensors.distance.object_detected;
	}

	async req_nepes_car_voice_trigger(sprite, script) {
		await this.reqInfo('req_voice_trigger_click')

		await this.request('req_voice_trigger_click', null, 1, true);

		return script.callReturn();
	}

	async req_nepes_car_TTS(sprite, script) {
		// ��ũ��Ʈ���� 'TEXT_TO_SPEECH' �Ķ������ ���� �����ɴϴ�.
		const stot = script.getStringValue('TTS_VALUE');
		console.log(script);

		// ������� ���� �ؽ�Ʈ �� ���
		console.log('[req_tts] : ' + stot + stot.length);

		// �ؽ�Ʈ ���̿� ���� ���� �ð� ����
		const textLength = stot.length;
		let delayTime;

		// �ؽ�Ʈ ���̿� ���� �����̸� �����մϴ�.
		if (textLength > 50) {
			Entry.toast.warning('���ڼ� 50�� �������� ���� ���ۺҰ�', '���� ���ڼ� = ' + textLength,false)
			return; //���ڼ� �ʰ��� ���� ���� ����
		}

		try {
			// TTS ������ �ϵ��� �����մϴ�.
			await this.request('req_tts', null, stot, true);

			// ������ ���� �Բ� reqInfo ȣ��
			await this.reqInfo('req_tts', 0);
		} catch (error) {
			// ������ �߻����� ��� ������ ����մϴ�.
			console.error('Error in req_text_to_speech:', error);
		}

		// ��ũ��Ʈ ���� �ϷḦ ��ȯ�մϴ�.
		return script.callReturn();
	}

	async req_nepes_car_TTS_waiting(sprite, script) {
		// ��ũ��Ʈ���� 'TEXT_TO_SPEECH' �Ķ������ ���� �����ɴϴ�.
		const stot = script.getStringValue('TTS_VALUE');
		console.log(script);

		// ������� ���� �ؽ�Ʈ �� ���
		console.log('[req_tts] : ' + stot + stot.length);

		// �ؽ�Ʈ ���̿� ���� ���� �ð� ����
		const textLength = stot.length;
		let delayTime;

		// �ؽ�Ʈ ���̿� ���� �����̸� �����մϴ�.
		if (textLength <= 30) {
			delayTime = 5000;
		} else if (textLength <= 40) {
			delayTime = 6000;
		}else if (textLength <=50) {
			delayTime = 7000;
		} else {
			Entry.toast.warning('���ڼ� 50�� �������� ���� ���ۺҰ�', '���� ���ڼ� = ' + textLength,false);

			return; //���ڼ� �ʰ��� ���� ���� ����
		}

		try {
			// TTS ������ �ϵ��� �����մϴ�.
			await this.request('req_tts', null, { stot }, true);

			// ������ ���� �Բ� reqInfo ȣ��
			await this.reqInfo('req_tts', delayTime);

		} catch (error) {
			// ������ �߻����� ��� ������ ����մϴ�.
			console.error('Error in req_text_to_speech:', error);
		}

		// ��ũ��Ʈ ���� �ϷḦ ��ȯ�մϴ�.
		return script.callReturn();
	}

	async req_nepes_car_stop_sound(sprite, script) {
		await this.reqInfo('req_stop_sound')

		await this.request('req_stop_sound', null, 1, true);

		return script.callReturn();
	}

	async req_nepes_car_set_volume(sprite, script) {
		const volume = parseInt(script.getStringValue('SOUND_VOLUME'), 10);

		if (volume > 100) {
			Entry.toast.warning('������ 0 ~ 100���� �Է�');

			return; //���ڼ� �ʰ��� ���� ���� ����
		}

		await this.request('req_volume', null, { volume: volume }, true);

		return script.callReturn();
	}

	async req_nepes_car_ai_play_alert(sprite, script)	{
		const alert_snd = script.getStringValue('SOUND_VOLUME');
		let alert_idx = 0;

		if (alert_snd == 'HORN')
			alert_idx = 0;
		else if (alert_snd == 'DINGDONG')
			alert_idx = 1;
		else if (alert_snd == 'BONUS')
			alert_idx = 2;
		else if (alert_snd == 'CLEAR')
			alert_idx = 3;

		await this.request('req_play_alert', null, { idx: alert_idx }, true);

		return script.callReturn();
	}
}

module.exports = { Block_NepesAICarBase, PreAction };


