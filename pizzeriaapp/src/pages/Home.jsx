import image1 from "/image-1.webp";
import image2 from "/image-2.webp";
import image3 from "/image-3.webp";

function Home() {
  return (
    <div className="container py-2">
      <h1 className="h1 mt-3 text-center">Our Story</h1>
      <p className="pt-2">
        We believe in good. We launched Fresh Pan Pizza Best Excuse Awards on
        our Facebook fan page. Fans were given situations where they had to come
        up with wacky and fun excuses.The person with the best excuse Badge and
        won Pizzeria&apos;s vouchers. Their enthusiastic response proved that
        Pizzeria&apos;s Fresh Pan Pizza is the Tastiest Pan Pizza Ever!
      </p>
      <p>
        Ever since we launched the Tastiest Pan Pizza, ever, people have been
        able to resist the softest, cheesiest, crunchiest, butteriest
        Domino&apos;s Fresh Pan Pizza. They have leaving the stage in the middle
        of a performanceand even finding excuses to be disqualified in a
        football match.
      </p>
      <p>
        We launched Fresh Pan Pizza Best Excuse Awards on our Facebook fan page.
        Fans were given situations where they had to come up with wacky and fun
        excuses.The person with the best excuse Badge and won Pizzeria&apos;s
        vouchers. Their enthusiastic response proved that Pizzeria&apos;s Fresh
        Pan Pizza is the Tastiest Pan Pizza Ever!
      </p>
      <div className="d-flex flex-lg-row flex-column align-items-center justify-content-between gap-4">
        <img src={image1} alt="" className="w-100" />
        <div>
          <h3 className="h3 fw-semibold">Ingredients</h3>
          <p>
            We&apos;re ruthless about goodness. We have no qualms about tearing
            up a day-old lettuce leaf (straight from the farm), or steaming a
            baby (carrot). Cut. Cut. Chop. Chop. Steam. Steam. Stir. Stir. While
            they&apos;re still young and fresh - that&apos;s our motto. It makes
            the kitchen a better place.
          </p>
        </div>
      </div>
      <div className="d-flex flex-lg-row flex-column-reverse align-items-center justify-content-between gap-4">
        <div>
          <h3 className="h3 fw-semibold">Chefs</h3>
          <p>
            They make sauces sing and salads dance. They create magic with
            skill, knowledge, passion, and stirring spoons (among other things).
            They make goodness so good. It doesn't know what to do with itself.
            We do though. We send it to you.
          </p>
        </div>
        <img src={image2} alt="" className="w-100" />
      </div>
      <div className="d-flex flex-lg-row flex-column align-items-center justify-content-between gap-4">
        <img src={image3} alt="" className="w-100" />
        <div>
          <h3 className="h3 fw-semibold">Delivery</h3>
          <p>
            We offer 45 minutes delivery guarantee. Because we know that
            goodness can&apos;t wait. Our delivery executives are trained to
            handle food with care and deliver it piping hot, right to your
            doorstep.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Home;
