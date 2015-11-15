This is a small write-up that goes with this application:

Summary of Technologies used
----------------------------
Esprima, jQuery, javascript, html5, css3, sass (and compass), CodeMirror


Acorn vs. Esprima.
------------------
The author of Acorn himself admits that it is nearly identical to Esprima and there is no good reason for it to exist.  The APIs of Acorn and Esprima are practically identical.  Acorn may be faster, but a small speed difference is unimportant because Esprima is already very fast.  Esprima has a much bigger user base and has a lot more support.  It is more robust.  Esprima was recently adopted by the jQuery foundation, which is a good sign that it will be around for a while and is in good hands.  Mainly for these reasons, I favor using Esprima.  I hope that Esprima will adopt some of the performance improvements (and file-size improvements) of Acorn and get the best of both worlds in the future.


What I would do if I had more time:
-----------------------------------

  1. Test on a PC (IE and Firefox).  I don't have a PC and I didn't have time to install a virtual machine.

  2. Implement asynchronous functions if necessary

  3. perhaps pass around arrays for the exists_all_constructs method.

  4. Use require.js to make JS structure more organized

  5. build a unit test for my functions (the "exists" ones specifically)

  6. consider using the _loop functions themselves as the keys in the construct tree.  If this is possible, it would be more elegant. Didn't think of that originally!

  7. error checking for construct_tree inputs

  8. airplanes were going to fly in the correct/incorrect banners when the Feedback: Button option was chosen.