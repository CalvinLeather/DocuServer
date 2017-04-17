<h3>DocuServer</h3>
<p>This is a lightweight node.js-based document server intended for use with academic research papers. It features some nifty tricks such as DOI, author, title and genre (forthcoming) recognition, automatic tag creation, fast search, and custom fields (forthcoming). It is intended to be run on minimal, commodity hardware (e.g. Raspberry Pi w USB drive storage), and as such performs much of the processing on client devices (using pdf.js libraries and some offline NLP).</p>

<p>The project is still very much WIP</p>

<h4>Usage</h4>
<p>Use <code>npm install --save</code> to install dependencies.I used bower for pdfjs, and will be switching this packedge over to npm soon, but for now, its included the repo.</p>
<p>You'll need to define a .env file with MONGO URIs for read/write and read-only users:
<pre>
exports MONGOURI_RW=mongodb://*****
exports MONGOURI_R=mongodb://******
</pre>
</p>
