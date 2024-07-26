import React from 'react';
import "../app/notfound.scss"
import { Button } from '@/components/ui/button';
import Link from 'next/link';
const NotFound = () => {
  return (
 <>
  
  <main className="error-page h-[64dvh] flex justify-center items-center">
  <div className="container flex items-center justify-center">
    <div className="eyes">
      <div className="eye">
        <div className="eye__pupil eye__pupil--left"></div>
      </div>
      <div className="eye">
        <div className="eye__pupil eye__pupil--right"></div>
      </div>
    </div>

    <div className="error-page__heading">
      <h1 className="error-page__heading-title">Looks like you&apos;re lost</h1>
      <p className="error-page__heading-desciption font-bold text-lg">404 error</p>
    </div>

    <Link className="error-page__button" href={"/"} aria-label="back to home" title="back to home">back to home</Link>
  </div>
</main>
 </>
  );
};

export default NotFound;
