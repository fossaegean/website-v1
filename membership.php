<!DOCTYPE html>
<html>
<head>
  <title>Join Hackerspace.gr</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <link rel="stylesheet" type="text/css" href="static/css/bootstrap.min.css">
  <link rel="stylesheet" type="text/css" href="static/css/app.css">
  <link rel="shortcut icon" href="favicon.ico">
</head>
<body>

<div class="container" style="margin-bottom:10px;">
<script>
    if (window==window.top) {
        document.write('<div class="page-header"><p><img alt="logo" src="static/img/hackerspace.svg"></p>');
        document.write('<span style="font-weight:bold;">Join Hackerspace.gr</span></div>');
    }
</script>
<form action="<?php echo $_SERVER['PHP_SELF'] ?>" method="post">
<?php

    require_once('recaptchalib.php');
    require_once('recaptcha-keys.php');
    # the response from reCAPTCHA
    $resp = null;
    # the error code from reCAPTCHA, if any
    $error = null;
    # was there a reCAPTCHA response?
    if ( $_POST["recaptcha_response_field"] ) {
        $resp = recaptcha_check_answer ($privatekey,
                                        $_SERVER["REMOTE_ADDR"],
                                        $_POST["recaptcha_challenge_field"],
                                        $_POST["recaptcha_response_field"]);
        // Sanitize
        $name = htmlspecialchars(stripslashes(trim($_POST['name'])));
        $email = htmlspecialchars(stripslashes(trim($_POST['email'])));
        $memberspage = $_POST['memberspage'];
        $memberslist = $_POST['memberslist'];
        $addrrec = htmlspecialchars(stripslashes(trim($_POST['addrrec'])));
        $addrstreet = htmlspecialchars(stripslashes(trim($_POST['addrstreet'])));
        $addrpo = htmlspecialchars(stripslashes(trim($_POST['addrpo'])));
        $addrcity = htmlspecialchars(stripslashes(trim($_POST['addrcity'])));
        $addrcountry = htmlspecialchars(stripslashes(trim($_POST['addrcountry'])));

        if ( $resp->is_valid && (strlen($name) != 0) && (strlen($email) != 0)) {
            $text = "name: ".$name."\nemail: ".$email."\nmemberspage: ".$memberspage."\nmemberslist: ".$memberslist."\n\n";
            $text = $text."recipient: ".$addrrec."\nstreet: ".$addrstreet."\npo: ".$addrpo."\ncity: ".$addrcity."\ncountry: ".$addrcountry;
            mail($mailto,"[hsgr] Membership request","$text","From: hsgrbot <noreply@hackerspace.gr>");
            echo "<div class='alert alert-success membership-notice'>Thank you! Just one more step...<br><br>Pay your first <a href='https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=SU9M26K3ALNV8' target='_blank'>3-month subscription</a>.</div>";
        } else {
            # set the error code so that we can display it
            $error = $resp->error;
            $errormsg = '<p class="text-danger">You either missed a required field or captcha</p>';
        }
    }

    if ( !$resp->is_valid ) {
?>
<div class="alert alert-info membership-notice">
  All members have the following rights/obligations:
  <ul>
    <li>Mention at the <a href="https://www.hackerspace.gr/wiki/People" target="_blank">Members page</a> (optional).</li>
    <li>A <a href="http://hackadaycom.files.wordpress.com/2013/10/hackerspace-passport-custom.jpg?w=580&h=302" target="_blank">Hackerspace Passport</a> with our stamp (optional).</li>
    <li>Financial support of Hackerspace.gr with a 3-month subscription (60&euro;).</li>
    <li>Endless respect from everyone else :-)</li>
  </ul>
</div>
<div><?php echo $errormsg; ?></div>
<div class="form-group has-error">
  <label for="Name">Name</label>
  <input type="text" class="form-control" name="name" required>
</div>
<div class="form-group has-error">
  <label for="Email">Email</label>
  <input type="email" class="form-control" name="email" required>
</div>
<div class="checkbox">
  <label>
    <input type="checkbox" name="memberspage" value="1"> Add me to <a href="https://www.hackerspace.gr/wiki/People" target="_blank">members page</a>.
  </label>
</div>
<div class="checkbox">
  <label>
    <input type="checkbox" name="memberslist" value="1"> Subscribe to members mailing list.
  </label>
</div>
<?php
  echo recaptcha_get_html($publickey, $error);
?>
<hr>
<div class="form-group">
  <label for="address">Shipping Address - <small>in case you want your hackerspace passport :)</small></label>
  <label for="Recipient">Recipient</label>
  <input type="text" class="form-control" name="addrrec" placeholder="Recipient">
  <label for="Street">Street</label>
  <input type="text" class="form-control" name="addrstreet" placeholder="Street">
  <label for="P.O.">P.O.</label>
  <input type="text" class="form-control" name="addrpo" placeholder="P.O.">
  <label for="City">City</label>
  <input type="text" class="form-control" name="addrcity" placeholder="City">
  <label for="Country">Country</label>
  <input type="text" class="form-control" name="addrcountry" placeholder="Country">
</div>
<button type="submit" class="btn btn-primary">Send</button>

<?php
    }
?>
</div>
</body>
</html>
