---
title: Designing the e-ID Card Management and Distribution Portal for IIT Roorkee
description: Distributing and managing the physical ID cards of more than 8000 students was a hassle for the Dean of Students' Welfare. Hence we developed this in-house tool to digitalise ID cards, distribute them, and manage and resolve queries if any.
order: 6
tags: [SaaS Design, In-house Tool]
client: DoSW, IIT Roorkee
timeline: December 2021 - February 2022
team: 2 designers, 1 manager
goal: Digitalising the students' ID card, and building a distribution, renewal, and query management portal for IIT Roorkee.
results:
  - [10k+, e-ID cards distributed till date]
  - [~100%, Query resolution rate]
  - [90% less time, Required to resolve a query]
---

# Process

<h1>Why digitise my ID card?</h1>
<p>IIT Roorkee, up until 2021, issued physical ID cards for all their students and staff. Although they were convenient in the conventional sense, they presented their own set of problems:</p>
<ul><li>Poor durability: Students collected their (paper) ID card at the time of their registration, and kept the same for their entire course.</li><li>Low credibility: Although issued by a government facility, it had no watermark, seal, or any other indication that the given specimen is real and not a fake. A fake ID card could easily be made by printing out the form on a normal sheet of paper.</li><li>Incorrect data: The data on the ID card was filled out by hand by the admins. If something was misspelt or some data had to be changed, the student had to go through a long and tedious process.</li><li>Re-issuing the ID card: Doctorate students had to renew their ID card after every year, since their tenure was not fixed.</li><li>Losing your ID card: If your ID card was lost, the process to get a new one issued was long, extremely tedious, and involved going to the police as well (we will get into this later).</li></ul>
<p>&nbsp;</p>
<p>&nbsp;</p>
<h1>Who took care of these queries?</h1>
<p>The Dean of Students' Welfare (DoSW) attended to these queries. The process was as follows:</p>
<ol><li>The DoSW receives 50–100 mails each day, only some of which are concerned with the ID card.</li><li>There was no method to collect these queries in one place. Mails had varying subjects with no emerging pattern, and the requests varied significantly.</li><li>Solving queries had no specific process some required going to the department head, some required mails to another dean, while some required changing info on the academics portal.</li><li>The DoSW mailed the concerned admins, while keeping the student in the loop.</li><li>Keeping track of the resolved and unresolved queries was difficult.</li><li>The student had to repeatedly reply to the mail, exchanging information and progress with the busy staff.</li></ol>
<p>&nbsp;</p>
<p>On top of all this, keeping track of the queries was extremely difficult due to a lack of system and procedure.</p>
<p>&nbsp;</p>
<p>&nbsp;</p>
<h1>Was it really that difficult?</h1>
<p>Actually, no. To understand the process, we had to first understand what different types of queries were.</p>
<p>&nbsp;</p>
<p>&nbsp;</p>
<h3>1. Data correction</h3>
<p>This was the most common type. Students wanted their addresses, phone numbers and emergency contacts changed. The process was simple:</p>
<p>&nbsp;</p>
<figure class="figure-image align-center"><div><img alt="" src="frame-15694.avif"></div></figure>
<p>&nbsp;</p>
<p>But students did not know about this process, hence a few extra steps were added:</p>
<p>&nbsp;</p>
<figure class="figure-image align-center"><div><img alt="" src="frame-15695.avif"></div></figure>
<p>&nbsp;</p>
<p>This added tediousness and delay in the process, not to mention the frustration on the admin's side.</p>
<p>&nbsp;</p>
<h3>2. Renewal</h3>
<p>ID cards for doctoral candidates were issued only for a year, and had to be renewed every subsequent year that they wanted to continue their research. Simiar to the previous case, there were differences in the ideal and actual flow:</p>
<p>&nbsp;</p>
<figure class="figure-image align-full" style="max-width:2808px"><div><img alt="" src="frame-15708.avif"></div></figure>
<p>&nbsp;</p>
<h3>3. Lost ID card</h3>
<p>Similarly, the process was unnecessarily tedious for the last case, a lost ID card:</p>
<p>&nbsp;</p>
<figure class="figure-image align-full" style="max-width:2808px"><div><img alt="" src="frame-15709.avif"></div></figure>
<p>&nbsp;</p>
<blockquote>Each additional step added a few days to the entire process, with the end-to-end flow often taking more than 2 weeks. Hence, optimising the flow was our first priority. </blockquote>
<p>&nbsp;</p>
<h3>Talking to the stakeholders</h3>
<p>We interviewed the people on the admin side of this process, and this is what they told us:</p>
<p>&nbsp;</p>
<figure class="figure-image align-full" style="max-width:936px"><div><img alt="" src="frame-15712.avif"></div></figure>
<p>&nbsp;</p>
<ul><li>Both the professors felt that managing the queries on mail was a tedious task and there should be a better method way of management.</li><li>Another problem that they faced is that the students barged right into the office with their queries. Students don’t even know the basics of resolving common queries.</li><li>Sending multiple requests about the same mistake was another hurdle. The queries become redundant and replying to them is a hassle.</li></ul>
<p>&nbsp;</p>
<p>At this point, we laid down our two main problems to solve:</p>
<ol><li>Digitise the process of distributing the ID card.</li><li>Digitise the query raising and resolution process.</li></ol>
<p>&nbsp;</p>
<p>&nbsp;</p>
<h1>Time to Develop<em> </em>Solutions</h1>
<p>Having collected enough resources and data, we started developing multiple solutions for the same.</p>
<p>&nbsp;</p>
<h2>The ID Card</h2>
<p>The ID card needed a revamp for efficient online usage. It had to be clear, consistent, legible and should display only the necessary information.</p>
<p>&nbsp;</p>
<figure class="figure-image align-center"><div><img alt="" src="1-ij4faepk0csmyuxabrenaw-2x.avif"></div></figure>
<p>&nbsp;</p>
<p>Apart from the standard info —</p>
<ul><li>The ID card had to be non-duplicable.</li><li>One should be able to scan the ID card easily.</li></ul>
<p>To tackle both of the factors, a <strong>QR code was introduced in the ID card</strong>. It served as an extra layer of authentication.</p>
<p>Some of the iterations created for the ID card are shown.</p>
<p>&nbsp;</p>
<figure class="figure-image align-center"><div><img alt="" src="1-h9yq9gagl0tc-xtlynvdq.avif"></div></figure>
<figure class="figure-image align-center"><div><img alt="" src="1-n-1veg42z37xn803gvyt-q.avif"></div></figure>
<p>&nbsp;</p>
<h2>Viewing ID Card — Student Side</h2>
<p>The student side portal had to take care of —</p>
<ul><li>Viewing and downloading ID card</li><li>Raising queries</li><li>Knowing about the standard correction procedures of common queries</li><li>Managing and knowing the status of queries</li></ul>
<p>Some iterations of the same screen are shown below —</p>
<figure class="figure-image align-center"><div><img alt="" src="1-zt8pi11ix-xmkdxcjt7eca.avif"></div></figure>
<p>Changes were introduced in our feedback sessions with the DoSW. <strong>He asked us to give the information about the usage of the e-ID card and the option to directly print the card.</strong></p>
<p>We tried to give an option for the student to edit their details here itself. But this was later deemed not possible as discussed later in the article.</p>
<p>&nbsp;</p>
<h2>Raising a query — Student Side</h2>
<p>This feature was already present widely in almost all websites and services. Thus, we had a load of resources to take inspiration from.</p>
<figure class="figure-image align-full" style="max-width:1400px"><div><img alt="" src="1-ychc2xv28g-w9xjmpn510a.avif"></div></figure>
<p>&nbsp;</p>
<p>The query types that we thought could be there were —</p>
<ul><li>Misspelt information.</li><li>Misprinted colours/alignment.</li><li>ID card not received.</li><li>Extension of validity.</li></ul>
<p>&nbsp;</p>
<p><strong>In our exploration, we were thinking of giving a feature to directly message the DoSW. In our feedback session, it was revealed that this was not a good idea.</strong></p>
<p>This was due to several reasons —</p>
<ul><li>Students could use informal language with the professor.</li><li>Most conversations only last up to 2 messages on mail.</li><li>The messaging feature would spam the DoSW’s inbox with redundant reminders from students.</li><li>It would bring a lot of load and server costs to the tech team.</li></ul>
<figure class="figure-image align-center"><div><img alt="" src="1-lknkdqrg-ulgqs687copca.avif"></div></figure>
<p>&nbsp;</p>
<p>After several discussions, the chat feature was discarded, but <strong>we decided to give the student an option to explain their query in a description box</strong>.</p>
<p>&nbsp;</p>
<p>Also, it was decided that in case the DoSW wants to reject a query, they should also explain the reason for rejection.</p>
<p>&nbsp;</p>
<p>Hence, <strong>a single message chat system was incorporated into the product</strong>.</p>
<p>&nbsp;</p>
<h2>Query Management and Review — DoSW Side</h2>
<p>This part of the solution involved regular feedback and interviews since we were not familiar with the management techniques used by the DoSW.</p>
<p>&nbsp;</p>
<p><strong>We took inspiration from the already existing certification portal</strong> and referred to its design system.</p>
<figure class="figure-image align-full" style="max-width:1400px"><div><img alt="" src="1-s-winirj49-hfa8hr0yxuw.avif"></div><figcaption>Snapshots of the Certification Portal</figcaption></figure>
<p>The certification portal consisted of —</p>
<ul><li>List of students to whom the aforementioned certificate would be issued.</li><li>Option to accept or reject a list.</li><li>On reject, send a message describing why it was rejected.</li><li>View the details of students, and the certificates they would be getting.</li></ul>
<p>&nbsp;</p>
<p>On the e-ID management portal, we had to show—</p>
<ul><li>The information of the student who raised the query.</li><li>Option to reissue or reject the query.</li><li>Giving the reason to reject.</li><li>This would be replaced by the reason they need a new ID card/ the misinformation in the card in the e-ID card portal.</li></ul>
<p>&nbsp;</p>
<h2>The Authority Dilemma</h2>
<p>In one of our discussions, the developer team explained to us the procedure to display the e-ID card —</p>
<ul><li>Create a copy of all the information of students from the academics portal.</li><li>Create a template of the ID card using HTML and CSS.</li><li>Feed information from the backend to the ID card for each student.</li></ul>
<p>&nbsp;</p>
<p>They explained that they need not add the DoSW in the circle of issue and re-issue, since the ID card is generated dynamically. Hence, <strong>any information updated on the acad portal would be directly reflected in the ID card</strong>.</p>
<p>&nbsp;</p>
<p>But the DoSW countered the proposition, saying that we are stripping the DoSW from their ability to control the flow of ID cards.</p>
<p><strong>The DoSW demanded that the supreme authority of granting the ID card remain with him, and not be shifted to the frontend.</strong></p>
<p>&nbsp;</p>
<p>To maintain this balance of power we added a trigger in the portal —<strong> the information from the acad portal will only be refreshed once the DoSW agrees to reissue the ID card.</strong> Moreover, the ID card will only be reissued if the query on our portal and the changed information on the acad portal are identical.</p>

# Final solution

<h1>Ready to Deliver</h1>
<p>&nbsp;</p>
<h2>The ID Card</h2>
<p>In the end, the ID card was decided to have 2 sides, since it was not feasible to put all the information in a legible format on a single side.</p>
<p>&nbsp;</p>
<p><strong>The colours were chosen to go with the institute’s website and branding</strong>. A clearer version of the logo than the previous ID card was placed on the top to add to the authenticity and pride of the institute.</p>
<p>&nbsp;</p>
<figure class="figure-image align-full" style="max-width:1400px"><div><img alt="" src="1-4n7h5l6gleux9jteaffz7q.avif"></div></figure>
<p>&nbsp;</p>
<p>The design overall was liked by all as it was legible, easily scannable, and clean.</p>
<p>&nbsp;</p>
<h2><strong>Viewing the e-ID card — Student Side</strong></h2>
<p>The e-ID card was given a separate row in the certificates table of the already existing certification portal.</p>
<p>&nbsp;</p>
<figure class="figure-image align-full" style="max-width:1400px"><div><img alt="" src="1-4rawawwmr8gzequ8uelopw.avif"></div></figure>
<p>&nbsp;</p>
<p>On clicking ‘view’, the ID card, instructions about its usage, and a list of raised queries were given, with the option to raise another.</p>
<p>&nbsp;</p>
<figure class="figure-image align-full" style="max-width:1400px"><div><img alt="" src="1-qvhnhrpdd9bvasncs8b-ba.avif"></div></figure>
<p>&nbsp;</p>
<h2>Raising a Query — Student Side</h2>
<p>The finalized flow for raising a query is as follows:</p>
<p>&nbsp;</p>
<figure class="figure-image align-full" style="max-width:1400px"><div><img alt="" src="1-oonkwqhkiv1vyedooeip3q.avif"></div></figure>
<p>&nbsp;</p>
<p>There are 3 pre-defined query types. The data entered in each of the query types varies—</p>
<ul><li><strong>Incorrect data</strong> — description, incorrect data field, original value (auto-filled), corrected value.</li><li><strong>Technical or design side error </strong>— description, e-ID card photo (auto-sent) file (optional).</li><li><strong>Other </strong>queries not covered by the above 3 types — description, file (optional).</li></ul>
<p>&nbsp;</p>
<figure class="figure-image align-full" style="max-width:1400px"><div><img alt="" src="1-1jq4xw8sohatk3bko4m87a.avif"></div></figure>
<p>&nbsp;</p>
<p>A feature of the form is that one can <strong>mark their query as important.</strong> On doing so, the query is shown at the top of DoSW’s portal. An exclamation mark denotes the same. This is to take care of instances where a person urgently needs their ID card.</p>
<p>&nbsp;</p>
<p>In addition to the form, the standard procedure for correcting the query is given as an overlay when a query type is selected.</p>
<p>&nbsp;</p>
<figure class="figure-image align-full" style="max-width:1400px"><div><img alt="" src="1-hf65ls2l5fowxflnwwrzva.avif"></div></figure>
<p>&nbsp;</p>
<h2>Managing Queries — Student Side</h2>
<p>After raising a query, one has the option to know the status of their queries. This is shown where a person’s queries are present.</p>
<p>&nbsp;</p>
<figure class="figure-image align-full" style="max-width:1400px"><div><img alt="" src="1-nfetdp4kiabrcarnw0zwoa.avif"></div></figure>
<p>&nbsp;</p>
<p>A query entry shows the type of query, the date it was raised, the description, and the status. In case the query is resolved, all is well and good. <strong>If it is rejected, one may see the remark associated with it.</strong></p>
<p>&nbsp;</p>
<figure class="figure-image align-full" style="max-width:1400px"><div><img alt="" src="1-dxqnxuapkggocomcaf-zlw.avif"></div></figure>
<p>&nbsp;</p>
<h2>Query Management Portal — DoSW Side</h2>
<p>This was the final product on my part. The finalized flow for the same is given below:</p>
<p>&nbsp;</p>
<figure class="figure-image align-full" style="max-width:1400px"><div><img alt="" src="1-sqzqqcgmimxaluovnswzra.avif"></div></figure>
<p>&nbsp;</p>
<p><em>The queries that couldn’t be handled by the DoSW (eg. glitchy name, unsupported characters etc.) were to be </em><strong><em>forwarded to the technical team manually.</em></strong></p>
<p>&nbsp;</p>
<h2>1. Correction of Data</h2>
<p>The queries are shows in a systematic, easy to scan list. <strong>The important queries are shown at the top</strong>, while other queries are shown after that. The resolved queries are shown at the bottom.</p>
<p>&nbsp;</p>
<figure class="figure-image align-full" style="max-width:1400px"><div><img alt="" src="1-ebib0sre-mud9s23fln-2w.avif"></div></figure>
<p>&nbsp;</p>
<p>In case a query has to be rejected, a message stating why it has been rejected also needs to be added.</p>
<p>&nbsp;</p>
<figure class="figure-image align-full" style="max-width:1400px"><div><img alt="" src="1-tbl-pki2wknbby8ue6hlnw.avif"></div></figure>
<p>&nbsp;</p>
<p>Resolve All — A ‘Resolve all’ button was given as a bulk action for the table. This was useful in case of technical glitches, where a reissue of an ID card was necessary.</p>
<p>&nbsp;</p>
<figure class="figure-image align-full" style="max-width:1400px"><div><img alt="" src="1-7jxwns2f-ulyfwvv-z4txa.avif"></div></figure>
<p>&nbsp;</p>
<h2>2. Technical/Design Error</h2>
<p>This query type takes care of glitchy errors in name, layout, colour etc. This was quite common in the initial rollout since the frontend was buggy, and not responsive. The DoSW received a ton of queries regarding the same.</p>
<p>&nbsp;</p>
<p>As mentioned earlier, a photo of the ID card is always attached with the query, while any additional documents that might be needed are attached by the student.</p>
<p>&nbsp;</p>
<figure class="figure-image align-full" style="max-width:1400px"><div><img alt="" src="1-bunigy-xdia5ja103ujcoq.avif"></div></figure>
<p>&nbsp;</p>
<h2>3. Other Queries</h2>
<p>These consisted of all the other types of errors that could be there. The screens were similar to the technical/design error screens.</p>
<p>&nbsp;</p>
<figure class="figure-image align-full" style="max-width:1400px"><div><img alt="" src="1-9vrpr80txc6-710lq-qra.avif"></div></figure>
<p>&nbsp;</p>
<p>Although this type was used only in cases where an extension of the validity of the ID card was required.</p>

# Extras

<h1>The showcase</h1>
<p>Teamwork, dedication and a deep understanding of the academic system allowed us to successfully deliver the finalised product.</p>
<p>&nbsp;</p>
<figure class="figure-image align-full" style="max-width:1400px"><div><img alt="" src="1-5ucerom1kirgwpzqpb3qdq.avif"></div></figure>
<p>&nbsp;</p>
<p>&nbsp;</p>
<h1>That’s all for today 🏁</h1>
<p>It was a highly intensive project, having to coordinate between the development team and the administration, listening to their queries and needs, and demanding in-depth research.</p>
