describe('gkSound.init method', function() {

    before(function() {
        var conteiner = document.createElement("div");
        conteiner.id = 'conteiner';
        document.body.appendChild(conteiner);
    })

    beforeEach(function() {
        var e = document.getElementById("btnMute");
        var s = document.getElementById("sound");

        if(e !== null) {
            e.parentNode.removeChild(e);
            e = null;
        }

        if (s !== null) {
            s.parentNode.removeChild(s);
            s = null;
        }
    })

    it('not draw mute button', function() {
        gkSound.init(false);
        expect(document.getElementById("btnMute")).to.equal(null);
    })

    it('draw mute button in body', function() {
        gkSound.init(true);

        var e = document.getElementById("btnMute");
        expect(e).to.not.equal(null);
        expect((e.parentNode).nodeName).to.equal("BODY");
    })

    it('draw mute button in conteiner', function() {
        gkSound.init(true, conteiner);

        var e = document.getElementById("btnMute");
        expect(e).to.not.equal(null);
        expect((e.parentNode).nodeName).to.equal("DIV");
        
    })
});

describe('gkSound.addSound method', function() {
    it('without required parameters', function() {
        expect(gkSound.addSound()).to.equal(null);
        expect(gkSound.addSound('test')).to.equal(null);
    })

    it('with required parameters type wrong', function() {
        expect(gkSound.addSound(true, 'file')).to.equal(null);
        expect(gkSound.addSound(true, 20)).to.equal(null);
    })
});




