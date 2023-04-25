import { onBeforeUnmount, onMounted, watchEffect, ref, reactive } from 'vue'
import type { Ref } from 'vue'

export const useDraggable = (
  targetRefs: string,
  dragRef: Ref<HTMLElement | undefined>,
  draggable: boolean,
  contentRef: Ref<HTMLElement | undefined >
) => {
  const targetRef = ref()
  const jR = reactive({ x: 0, y: 0 })

  let transform = {
    offsetX: 0,
    offsetY: 0,
  }

  const onMousedown = (e: MouseEvent) => {
    const downX = e.clientX
    const downY = e.clientY
    const { offsetX, offsetY } = transform

    const targetRect = targetRef.value!.getBoundingClientRect()

    const targetLeft = targetRect.left - jR.x
    const targetTop = targetRect.top - jR.y
    const targetWidth = targetRect.width
    const targetHeight = targetRect.height
    const clientWidth = document.documentElement.clientWidth
    const clientHeight = document.documentElement.clientHeight

    const minLeft = -targetLeft + offsetX
    const minTop = -targetTop + offsetY
    const maxLeft = clientWidth - targetLeft - targetWidth + offsetX
    const maxTop = clientHeight - targetTop - targetHeight + offsetY

    const onMousemove = (e: MouseEvent) => {
      const moveX = Math.min(
        Math.max(offsetX + e.clientX - downX, minLeft),
        maxLeft
      )
      const moveY = Math.min(
        Math.max(offsetY + e.clientY - downY, minTop),
        maxTop
      )

      transform = {
        offsetX: moveX,
        offsetY: moveY,
      }
      targetRef.value!.style.transform = `translate(${moveX}px, ${moveY}px)`

    }

    const onMouseup = () => {
      document.removeEventListener('mousemove', onMousemove)
      document.removeEventListener('mouseup', onMouseup)
    }

    document.addEventListener('mousemove', onMousemove)
    document.addEventListener('mouseup', onMouseup)
  }

  const onDraggable = () => {
    if (dragRef.value && targetRef.value) {
      dragRef.value.addEventListener('mousedown', onMousedown)
    }
  }

  const offDraggable = () => {
    if (dragRef.value && targetRef.value) {
      dragRef.value.removeEventListener('mousedown', onMousedown)
    }
  }

  const getNavRefPoint = () => {
    const { x, y} = contentRef.value?.getBoundingClientRect() as DOMRect
    jR.x = x
    jR.y = y
    targetRef.value = document.querySelector(targetRefs)
  }

  window.addEventListener('resize', getNavRefPoint)

  onMounted(() => {
    watchEffect(() => {
      if (draggable) {
        getNavRefPoint()
        onDraggable()
      } else {
        offDraggable()
      }
    })
  })

  onBeforeUnmount(() => {
    window.removeEventListener('resize', getNavRefPoint)
    offDraggable()
  })
}
