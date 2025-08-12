import { HTMLFlipBook } from './PageFlip';

export default function PageFlipPage() {
  return (
    <HTMLFlipBook
      className="w-full h-screen"
      style={{}}
      startPage={0}
      size="stretch"
      width={400}
      height={600}
      minWidth={300}
      maxWidth={800}
      minHeight={400}
      maxHeight={1000}
      drawShadow={true}
      flippingTime={1000}
      usePortrait={true}
      startZIndex={0}
      autoSize={true}
      maxShadowOpacity={0.5}
      showCover={false}
      mobileScrollSupport={false}
      clickEventForward={true}
      useMouseEvents={true}
      swipeDistance={30}
      showPageCorners={true}
      disableFlipByClick={false}
    >
      <div className="page-1 w-full h-full bg-blue-200 flex items-center justify-center">
        <h1>Page 1</h1>
      </div>
      <div className="page-2 w-full h-full bg-red-200 flex items-center justify-center">
        <h1>Page 2</h1>
      </div>
      <div className="page-3 w-full h-full bg-green-200 flex items-center justify-center">
        <h1>Page 3</h1>
      </div>
    </HTMLFlipBook>
  );
}