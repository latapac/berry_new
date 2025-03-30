export const mstatus = ['Aborted', 'Stopped', 'Reseting', 'Idle', 'Execute','Running'];

export function getMstatusBGColor(status) {
    switch (status) {
        case 'STOP':
            return 'text-red-500';
        case 'Reseting':
            return 'text-yellow-500';
        case 'Idle':
            return 'text-blue-500';
        case 'Execute':
            return 'text-green-700';
        case 'Aborted':
            return 'text-orange-400';
        case 'RUNNING':
            return 'text-green-200';
        default:
            return 'text-gray-500';
    }
}