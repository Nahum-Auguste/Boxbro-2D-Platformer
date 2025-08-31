
/**
 * 
 * @param {HTMLCanvasElement} canvas 
 * @param {MouseEvent} event 
 */
export function getPosition(canvas,event) {
    const rect = canvas.getBoundingClientRect();

    return {
        x:event.clientX - rect.left,
        y:event.clientY - rect.top
    }
}
