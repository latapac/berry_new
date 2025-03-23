export const mstatus = ['Aborted', 'Stopped', 'Reseting', 'Idle', 'Execute'];

export function getMstatusBGColor(status) {
    switch (status) {
        case 'STOP':
            return 'text-red-500';
        case 'Reseting':
            return 'text-yellow-500';
        case 'Idle':
            return 'text-green-500';
        case 'Execute':
            return 'text-green-700';
        case 'Aborted':
            return 'text-orange-400';
        default:
            return 'text-gray-500';
    }
}