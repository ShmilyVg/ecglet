export async function notifyCurrentPage({eventName, eventValue}) {
    const currentPages = getCurrentPages(), length = currentPages.length;
    if (currentPages && length) {
        const page = currentPages[length - 1], {events} = page;
        if (events) {
            const event = events[eventName];
            event && event.call(page, eventValue);
        }
    }
}

export function notifyAllPage({eventName, eventValue}) {
    const currentPages = getCurrentPages(), length = currentPages.length;
    if (currentPages && length) {
        for (let page of currentPages) {
            const {events} = page;
            if (events) {
                const event = events[eventName];
                event && event.call(page, eventValue);
            }
        }
    }
}
