import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
	shouldSubmitChatBeforeInput,
	shouldSubmitChatKeydown,
} from '../src/lib/bot/keyboardSubmit.js';

describe('public bot keyboard submit', () => {
	it('submits ready messages from a physical Enter keydown', () => {
		assert.equal(
			shouldSubmitChatKeydown(
				{ key: 'Enter', shiftKey: false, isComposing: false },
				{ canSubmit: true, isComposing: false },
			),
			true,
		);
	});

	it('keeps Shift+Enter available for multiline input', () => {
		assert.equal(
			shouldSubmitChatKeydown(
				{ key: 'Enter', shiftKey: true, isComposing: false },
				{ canSubmit: true, isComposing: false },
			),
			false,
		);
		assert.equal(
			shouldSubmitChatBeforeInput(
				{ inputType: 'insertLineBreak', isComposing: false },
				{ allowLineBreak: true, canSubmit: true, isComposing: false },
			),
			false,
		);
	});

	it('submits ready messages from soft-keyboard line break input', () => {
		assert.equal(
			shouldSubmitChatBeforeInput(
				{ inputType: 'insertLineBreak', isComposing: false },
				{ allowLineBreak: false, canSubmit: true, isComposing: false },
			),
			true,
		);
	});

	it('does not submit while composing or when the message cannot submit', () => {
		assert.equal(
			shouldSubmitChatKeydown(
				{ key: 'Enter', shiftKey: false, isComposing: true },
				{ canSubmit: true, isComposing: false },
			),
			false,
		);
		assert.equal(
			shouldSubmitChatBeforeInput(
				{ inputType: 'insertLineBreak', isComposing: false },
				{ allowLineBreak: false, canSubmit: false, isComposing: false },
			),
			false,
		);
	});
});
