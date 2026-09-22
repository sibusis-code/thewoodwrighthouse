THE WOODWRIGHT HOUSE: WEBSITE
==============================

This is a complete, ready-to-upload website. There is nothing to install or build.
Open index.html in a browser to try it on your computer.

WHAT'S INSIDE
  index.html          Home page
  shop.html           The 3D shop
  gallery.html        Our work, photographs of finished pieces
  fabrics.html        Fabrics and finishes
  how-it-works.html   How it works and FAQ
  about.html          About
  contact.html        Contact form (sends via WhatsApp or email)
  policies.html       Delivery, warranty and privacy (DRAFT, see below)
  images/products/    Photographs of finished pieces
  css/, js/, vendor/  Styles, code and the 3D engine (kept local so the site loads fast)
  sitemap.xml, robots.txt

IMAGES
The photographs live in images/products/ and are named by kind, for example
bed-channel-oat.jpg or chair-petal-tub-emerald.jpg. The list that drives them
is WH.GALLERY near the top of js/data.js. Each line names the file, the
filters it shows under, a short name and the alt text a screen reader reads.

  To add a piece: put the photo in images/products/, give it a name in the
  same style, and add one line to WH.GALLERY.
  To remove a piece: delete its line. The file can stay where it is.

The photos appear on gallery.html, on the four cards on the home page, in the
Recent work strip, on fabrics.html, and beside the 3D shop where the strip
follows whichever category is on show.

THREE THINGS TO FIX BEFORE YOU LAUNCH
1. These are not photographs of your own work. Before you publish them, make
   sure you have the right to use each one. Photographs of furniture usually
   belong to whoever shot them or to the retailer who commissioned them, and
   showing another company's pieces as your own is a real risk. Replace them
   with photographs of what your workshops have actually built as soon as you
   can. That is also what will sell the work.
2. Two files are screenshots with an app icon in one corner:
   chair-petal-tub-emerald.jpg and chair-boucle-vanity-swivel-ivory.jpg.
   The "crop" setting on those lines in js/data.js pushes the icon out of
   frame, but a clean photo is better. A third,
   couch-channel-plinth-oat-rear.jpg, has a "1/3" badge and a heart on it and
   is not used anywhere. couch-lounge-suite-sand.jpg has a smudged-out
   watermark on the wall behind the couch.
3. mirror-wavy-boucle-ivory.png is 2.1 MB, which is slow on a phone. Save it
   as a JPEG at about 1200 px wide and it will drop to roughly 150 KB. Doing
   the same to the other photos is worth it too.

BEFORE YOU LAUNCH: 6 STEPS
1. Open js/data.js and fill in the settings at the top: your WhatsApp number,
   lead time, warranty term, contact details, bank details and delivery rates.
   Replace the SAMPLE prices (the "base" numbers) and SAMPLE delivery fees
   with your real ones.
2. Search every .html file for text in [SQUARE BRACKETS] and replace it with
   your real wording (for example [YOUR STORY], [YOUR POLICY], [PHOTO]).
3. Have policies.html checked by a legal professional. It is a draft, not legal advice.
4. In sitemap.xml and robots.txt, replace [YOURDOMAIN] with your real domain.
5. Replace the photographs in images/products/ with your own work, and check
   you have the right to use anything you did not shoot yourself. See IMAGES.
6. Upload everything in this folder to your hosting (the public_html folder
   on cPanel, or via FTP), keeping the folder structure. Then test on a phone.

HOW ORDERING WORKS
Quotes, swatch requests and the contact form open a ready-written WhatsApp
message (or email). Nothing is stored on the website itself. Card payments
need a server and a payment provider such as PayFast, and can be added later.

LATER
Add real photos (replace the [PHOTO] placeholders), swap the simple 3D models
for models of your workshop's actual designs, and add a Google Business Profile.
