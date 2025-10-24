<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    $title = $input['title'] ?? '';
    $content = $input['content'] ?? '';
    $image = $input['image'] ?? null;

    if (empty($title) || empty($content)) {
        echo json_encode(['success' => false, 'message' => 'Title and content are required']);
        exit;
    }

    $eventsFile = 'events.json';
    $events = [];
    if (file_exists($eventsFile)) {
        $events = json_decode(file_get_contents($eventsFile), true) ?? [];
    }

    $events[] = ['title' => $title, 'content' => $content, 'image' => $image];
    file_put_contents($eventsFile, json_encode($events, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));

    echo json_encode(['success' => true, 'message' => 'Event added successfully']);
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
}
?>
