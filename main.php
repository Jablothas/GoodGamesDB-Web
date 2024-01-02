<?php
include_once 'php/session_manager.php';

// Validate the user session
validateSession();
?>
<!DOCTYPE html>
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="icon" type="image/x-icon" href="img/favicon.ico">
        <link rel="stylesheet" type="text/css" href="css/styles.css">
        <link rel="stylesheet" type="text/css" href="css/form.css">
        <script src="js/components/jquery-3.7.1.js"></script>
        <script src="js/components/notify.js"></script>
        <script src="js/functions.js"></script>
        <script src="js/record.js"></script>
        <script src="js/input.js"></script>
        <title>GoodGamesDB 0.4.21</title>
    </head>
    <header>
        <div class="header">
            <div class="logo">
                <img src="img/logo.png">
                <h2>GoodGamesDB Web</h2>
            </div>
            <div class="buttons">
                <input class="search-input" id="searchbar" type="text" oninput="filterBySearch()">
                <button id="addButton" class="button" onclick="addButtonClick()" disabled></button>
                <button id="numbersButton" class="button" onclick="" hidden></button>
                <button id="settingsButton" class="button" onclick="" hidden></button>
                <button id="logoutButton" class="button" onclick="logoutButton()"></button>
            </div>
        </div>
    </header>
    <body onload="start()">
        <!-- Loader -->
        <div id="loader-wrapper">
            <div id="loader">
            </div>
          </div>          
        <!-- Popup Box for add new entry -->
        <div id="dialogModal" class="modal">
            <div id="modal-content" class="modal-content">
                <div id="edit-mode" class="edit-mode" hidden></div>
              <span class="close">&times;</span>
              <div id="img-cover-text" class="img-cover-text">Select</div>
              <form>
                <div class="horizontal-div">
                    <div><img id="img-cover" class="img-cover" onclick="changeCover()" src="img/covers/default.png"></div>
                    <div class="form-core">
                        <div class="header-input">
                            <div class="input-container">
                                <div>
                                    <br>Location
                                </div>
                                <div>
                                    <select tabindex="0" class="small-input" id="location" name="location" onblur="checkIfSteam()">
                                    </select>
                                </div>
                            </div>
                            <div class="input-container">
                                <div>
                                    <br>Replay
                                </div>
                                <div>
                                    <select class="small-custom-select" id="replay" name="replay">
                                        <option value="No">No</option>
                                        <option value="Yes">Yes</option>
                                    </select>
                                </div>
                            </div>
                            <div class="input-container">
                                <div>
                                    <br>Status
                                </div>
                                <div>
                                    <select class="small-custom-select" id="status" name="status" oninput="setRecordStatus(), checkIfRecordAlreadyExist()">
                                        <option value="Playing">Playing</option>
                                        <option value="Completed">Completed</option>
                                        <option value="Endless">Endless</option>
                                        <option value="Canceled">Canceled</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div>
                            <br>Game
                        </div>
                        <div>
                            <input class="basic-input" type="text" id="title" list="games-list" name="title" onblur="checkFormByGame()">
                            <datalist id="games-list">
                             </datalist>
                        </div>
                        <div id="steam-appid-label">
                            <br>AppId (Steam)
                        </div>
                        <div hidden>
                            <input class="basic-input" type="text" id="img-path" name="img-path" hidden>
                        </div>
                        <div hidden>
                            <input class="basic-input" type="text" id="record-id" name="record-id" hidden>
                        </div>
                        <div hidden>
                            <input class="basic-input" type="text" id="score-id" name="score-id" hidden>
                        </div>
                        <div>
                            <input class="basic-input" type="text" id="steam-appid" name="steam-appid" onblur="getPlaytime()">
                        </div>
                        <div class="start_date_check">
                            <br>Start date
                            <input type="checkbox" id="no_start_date" name="no_start_date" onclick="disableStartDate()" checked>
                        </div>
                        <div>
                            <input class="basic-input" type="date" id="start_date" name="start_date">
                        </div>
                        <div>
                            <br>End date
                        </div>
                        <div>
                            <input class="basic-input" type="date" id="end_date" name="end_date">
                        </div>
                        <div>
                            <br>Playtime in hours
                        </div>
                        <div>
                            <input class="basic-input" type="text" id="playtime" name="playtime" value="0">
                        </div>
                        <div>
                            <br>Note
                        </div>
                        <div>
                            <textarea class="textarea-input" id="note" name="note" rows="3" wrap="hard" maxlength="100"></textarea>
                        </div>
                    </div>
                    <div>
                        <div class="main-score-container" id="main-score-container">
                            <div class="left-slider-box">
                                <!-- Slider Gameplay -->
                                <div class="slider-container">
                                    <label for="slider_gameplay">Gameplay<br>
                                    <span style="color:grey"> Execution and engagement level of game mechanics.</span></label>
                                    <div style="display: flex; align-items: center;">
                                        <input type="range" id="slider_gameplay" min="1" max="10" value="1" oninput="updateSlider('slider_gameplay')">
                                        <span id="gameplay_value" class="slider-value">1</span>
                                        <input tabindex="-1" type="checkbox" id="slider_gameplay_check" name="slider_gameplay_check" onclick="disableSlider('slider_gameplay')" checked>
                                    </div>
                                </div>

                                <!-- Slider Presentation -->
                                <div class="slider-container">
                                    <label for="slider_presentation">Presentation<br>
                                    <span style="color:grey"> Visual and artistic aspects of the game including graphics, design, and style.</span></label>
                                    <div style="display: flex; align-items: center;">
                                        <input type="range" id="slider_presentation" min="1" max="10" value="1" oninput="updateSlider('slider_presentation')">
                                        <span id="presentation_value" class="slider-value"> 1</span>
                                        <input tabindex="-1" type="checkbox" id="slider_presentation_check" name="slider_presentation_check" onclick="disableSlider('slider_presentation')" checked>
                                    </div>
                                </div>

                                <!-- Slider Narrative -->
                                <div class="slider-container">
                                    <label for="slider_narrative">Narrative<br>
                                    <span style="color:grey"> Quality, coherence, and immersion of the game's story and characters.</span></label>
                                    <div style="display: flex; align-items: center;">
                                        <input type="range" id="slider_narrative" min="1" max="10" value="1" oninput="updateSlider('slider_narrative')">
                                        <span id="narrative_value" class="slider-value">1</span>
                                        <input tabindex="-1" type="checkbox" id="slider_narrative_check" name="slider_narrative_check" onclick="disableSlider('slider_narrative')" checked>
                                    </div>
                                </div>

                                <!-- Slider Quality -->
                                <div class="slider-container">
                                    <label for="slider_quality">Quality<br>
                                    <span style="color:grey"> Overall craftsmanship, attention to detail, and absence of technical issues in the game.</span></label>
                                    <div style="display: flex; align-items: center;">
                                        <input type="range" id="slider_quality" min="1" max="10" value="1" oninput="updateSlider('slider_quality')">
                                        <span id="quality_value" class="slider-value">1</span>
                                        <input tabindex="-1" type="checkbox" id="slider_quality_check" name="slider_quality_check" onclick="disableSlider('slider_quality')" checked>
                                    </div>
                                </div>

                                <!-- Slider Sound -->
                                <div class="slider-container">
                                    <label for="slider_sound">Sound<br>
                                    <span style="color:grey"> Effectiveness of audio elements such as music, voice acting, and sound effects in enhancing the game's atmosphere.</span></label>
                                    <div style="display: flex; align-items: center;">
                                        <input type="range" id="slider_sound" min="1" max="10" value="1" oninput="updateSlider('slider_sound')">
                                        <span id="sound_value" class="slider-value">1</span>
                                        <input tabindex="-1" type="checkbox" id="slider_sound_check" name="slider_sound_check" onclick="disableSlider('slider_sound')" checked>
                                    </div>
                                </div>
                                <!--
                                POTENTIAL PLACE FOR TOTAL_SUM    
                                <div class="form-score-sum" id="form-score-sum">0</div>
                                -->
                            </div>
                            <div class="right-slider-box">

                                <!-- Slider Content -->
                                <div class="slider-container">
                                    <label for="slider_content">Content<br>
                                    <span style="color:grey"> Quantity and variety of game content, including levels, quests, characters, and features.</span></label>
                                    <div style="display: flex; align-items: center;">
                                        <input type="range" id="slider_content" min="1" max="10" value="1" oninput="updateSlider('slider_content')">
                                        <span id="content_value" class="slider-value">1</span>
                                        <input tabindex="-1" type="checkbox" id="slider_content_check" name="slider_content_check" onclick="disableSlider('slider_content')" checked>
                                    </div>
                                </div>

                                <!-- Slider Pacing -->
                                <div class="slider-container">
                                    <label for="slider_pacing">Pacing<br>
                                    <span style="color:grey"> Flow and rhythm of the game to determine how well it keeps players engaged without feeling rushed or bored.</span></label>
                                    <div style="display: flex; align-items: center;">
                                        <input type="range" id="slider_pacing" min="1" max="10" value="1" oninput="updateSlider('slider_pacing')">
                                        <span id="pacing_value" class="slider-value">1</span>
                                        <input tabindex="-1" type="checkbox" id="slider_pacing_check" name="slider_pacing_check" onclick="disableSlider('slider_pacing')" checked>
                                    </div>
                                </div>

                                <!-- Slider Balance -->
                                <div class="slider-container">
                                    <label for="slider_balance">Balance<br>
                                    <span style="color:grey"> Considers whether challenges are appropriately tuned to provide a satisfying experience without being overly frustrating or too easy.</span></label>
                                    <div style="display: flex; align-items: center;">
                                        <input type="range" id="slider_balance" min="1" max="10" value="1" oninput="updateSlider('slider_balance')">
                                        <span id="balance_value" class="slider-value">1</span>
                                        <input tabindex="-1" type="checkbox" id="slider_balance_check" name="slider_balance_check" onclick="disableSlider('slider_balance')" checked>
                                    </div>
                                </div>

                                <!-- Slider UI/UX -->
                                <div class="slider-container">
                                    <label for="slider_ui_ux">UI/UX<br>
                                    <span style="color:grey"> Design and functionality of the user interface and overall user experience.</span></label>
                                    <div style="display: flex; align-items: center;">
                                        <input type="range" id="slider_ui_ux" min="1" max="10" value="1" oninput="updateSlider('slider_ui_ux')">
                                        <span id="ui_ux_value" class="slider-value">1</span>
                                        <input tabindex="-1" type="checkbox" id="slider_ui_ux_check" name="slider_ui_ux_check" onclick="disableSlider('slider_ui_ux')" checked>
                                    </div>
                                </div>
                                <!-- Slider Impression -->
                                <div class="slider-container">
                                    <label for="slider_impression">Impression<br>
                                    <span style="color:grey"> Overall impact and lasting impression the game leaves on the player, considering memorability, innovation, and uniqueness of the gaming experience.</span></label>
                                    <div style="display: flex; align-items: center;">
                                        <input type="range" id="slider_impression" min="1" max="10" value="1" oninput="updateSlider('slider_impression')">
                                        <span id="impression_value" class="slider-value">1</span>
                                        <input tabindex="-1" type="checkbox" id="slider_impression_check" name="slider_impression_check" onclick="disableSlider('slider_impression')" checked>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </form>
            <div class="submit-div">
                <button class="form-button" id="saveButton" onclick="saveNewEntry()"></button><button class="form-button-reset" id="cancelButton" onclick="resetEntry()"></button>
            </div>
            
            </div>    
          </div>
    </body>
</html>