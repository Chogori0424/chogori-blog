export function shouldSubmitChatKeydown(event, { canSubmit = false, isComposing = false } = {}) {
	return (
		event?.key === 'Enter' &&
		!event.shiftKey &&
		!event.isComposing &&
		!isComposing &&
		canSubmit
	);
}

export function shouldSubmitChatBeforeInput(
	event,
	{ allowLineBreak = false, canSubmit = false, isComposing = false } = {},
) {
	return (
		event?.inputType === 'insertLineBreak' &&
		!event.isComposing &&
		!isComposing &&
		!allowLineBreak &&
		canSubmit
	);
}
